import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SITE_NAME = 'fpc-gent-site';
const sitePath = path.resolve(__dirname, '../../sites', SITE_NAME);
const dataPath = path.join(sitePath, 'src/data');
const imagesPath = path.join(sitePath, 'public/images');

if (!fs.existsSync(imagesPath)) {
    fs.mkdirSync(imagesPath, { recursive: true });
}

// Insecure agent to bypass FPC Gent SSL
const agent = new https.Agent({
    rejectUnauthorized: false
});

const downloadImage = (url, filepath) => {
    return new Promise((resolve, reject) => {
        if (fs.existsSync(filepath)) {
            return resolve('exists');
        }

        https.get(url, { agent }, (res) => {
            if (res.statusCode === 200) {
                const fileStream = fs.createWriteStream(filepath);
                res.pipe(fileStream);
                fileStream.on('finish', () => {
                    fileStream.close();
                    resolve('downloaded');
                });
            } else {
                reject(new Error(`Status Code: ${res.statusCode}`));
            }
        }).on('error', (e) => {
            reject(e);
        });
    });
};

function getAllJsonFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const stat = fs.statSync(path.join(dir, file));
        if (stat.isDirectory()) {
            getAllJsonFiles(path.join(dir, file), fileList);
        } else if (file.endsWith('.json')) {
            fileList.push(path.join(dir, file));
        }
    }
    return fileList;
}

// Recursively find and replace image URLs
async function processNode(node) {
    let updated = false;

    if (typeof node === 'string') {
        if (node.startsWith('https://www.fpcnv.be/') && node.match(/\.(jpeg|jpg|png|gif|webp)$/i)) {
            const filename = path.basename(node);
            const targetPath = path.join(imagesPath, filename);
            try {
                const status = await downloadImage(node, targetPath);
                console.log(`[${status}] ${filename}`);
                // Return only the filename so EditableMedia handles it cleanly
                return { updated: true, val: filename };
            } catch (err) {
                console.error(`[ERROR] Failed to download ${filename}:`, err.message);
            }
        }
    } else if (Array.isArray(node)) {
        for (let i = 0; i < node.length; i++) {
            const res = await processNode(node[i]);
            if (res?.updated) {
                node[i] = res.val;
                updated = true;
            }
        }
    } else if (node && typeof node === 'object') {
        for (const key of Object.keys(node)) {
            const res = await processNode(node[key]);
            if (res?.updated) {
                node[key] = res.val;
                updated = true;
            }
        }
    }
    return { updated: false, val: node };
}

async function main() {
    console.log(`🚀 Starting Custom FPC Gent Media Downloader...`);
    const jsonFiles = getAllJsonFiles(dataPath);

    for (const file of jsonFiles) {
        try {
            const raw = fs.readFileSync(file, 'utf8');
            const data = JSON.parse(raw);

            const res = await processNode(data);
            if (res?.updated) {
                // If the object itself was updated (rare), replace data. Else, data mutated in place.
                const finalData = res.val;
                fs.writeFileSync(file, JSON.stringify(finalData, null, 2));
                console.log(`✅ Updated JSON file: ${path.basename(file)}`);
            }
        } catch (err) {
            console.error(`Failed to process ${file}:`, err);
        }
    }
    console.log('🎉 Done downloading and mapping images!');
}

main();
