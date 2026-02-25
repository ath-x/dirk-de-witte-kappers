import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SITE_NAME = 'fpc-gent-site';
const sitePath = path.resolve(__dirname, '../../sites', SITE_NAME);
const dataPaths = [
    path.join(sitePath, 'src/data/pages'),
    path.join(sitePath, 'public/data/pages')
];

function normalizeFields(obj) {
    let updated = false;
    const sourceKeys = ['image', 'foto', 'src'];
    
    // Process current level
    for (let key of sourceKeys) {
        if (obj[key] !== undefined && obj[key] !== null) {
            // If afbeelding is missing or empty, copy from sourceKey
            if (obj['afbeelding'] === undefined || obj['afbeelding'] === null || obj['afbeelding'] === "") {
                obj['afbeelding'] = obj[key];
                updated = true;
            }
        }
    }

    // Recurse into objects and arrays
    for (let key in obj) {
        if (obj[key] && typeof obj[key] === 'object') {
            if (normalizeFields(obj[key])) updated = true;
        }
    }
    
    return updated;
}

async function main() {
    dataPaths.forEach(dataPath => {
        if (!fs.existsSync(dataPath)) return;
        const files = fs.readdirSync(dataPath).filter(f => f.endsWith('.json'));
        console.log('🚀 Normalizing fields in ' + dataPath + ' (' + files.length + ' files)...');
        
        files.forEach(file => {
            const filePath = path.join(dataPath, file);
            const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            
            if (normalizeFields(data)) {
                fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
            }
        });
    });
    console.log('🎉 Field Normalization Complete.');
}
main();
