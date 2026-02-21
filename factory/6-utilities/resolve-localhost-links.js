/**
 * @file resolve-localhost-links.js
 * @description Utility to scan and replace localhost URLs with live URLs from the site registry.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const FACTORY_ROOT = path.resolve(__dirname, '../..');
const SITES_REGISTRY = path.join(FACTORY_ROOT, 'dock/public/sites.json');

async function main() {
    const args = process.argv.slice(2);
    const projectName = args[0];
    const dryRun = args.includes('--dry-run');

    if (!projectName) {
        console.error("❌ Gebruik: node 6-utilities/resolve-localhost-links.js <project-naam> [--dry-run]");
        process.exit(1);
    }

    const projectDir = path.join(FACTORY_ROOT, 'sites', projectName);
    const dataDir = path.join(projectDir, 'src/data');

    if (!fs.existsSync(dataDir)) {
        console.error(`❌ Project data map niet gevonden: ${dataDir}`);
        process.exit(1);
    }

    if (!fs.existsSync(SITES_REGISTRY)) {
        console.error(`❌ Sites registry niet gevonden: ${SITES_REGISTRY}`);
        process.exit(1);
    }

    const sites = JSON.parse(fs.readFileSync(SITES_REGISTRY, 'utf8'));
    
    // Bouw een map van poort naar liveUrl
    const portToLiveUrl = {};
    sites.forEach(site => {
        if (site.port && site.liveUrl) {
            portToLiveUrl[site.port] = site.liveUrl;
        }
        // Ook op naam mappen als backup (voor poorten die hergebruikt worden)
        if (site.id && site.liveUrl) {
            portToLiveUrl[site.id] = site.liveUrl;
        }
    });

    const jsonFiles = fs.readdirSync(dataDir).filter(f => f.endsWith('.json'));
    let totalChanges = 0;

    console.log(`🔍 Scannen van ${projectName} op localhost links...`);

    jsonFiles.forEach(file => {
        const filePath = path.join(dataDir, file);
        let content = fs.readFileSync(filePath, 'utf8');
        let fileChanged = false;

        // Regex voor localhost links: http://localhost:PORT/SITE/
        // We capturen de poort en de optionele site-naam
        const localhostRegex = /http:\/\/localhost:([0-9]+)\/([a-zA-Z0-9_-]+)?\/?/g;
        
        const newContent = content.replace(localhostRegex, (match, port, siteId) => {
            let targetUrl = portToLiveUrl[port] || portToLiveUrl[siteId];
            
            if (targetUrl) {
                // Zorg dat targetUrl eindigt op een slash als het origineel dat ook deed
                if (!targetUrl.endsWith('/')) targetUrl += '/';
                
                console.log(`   ✨ [${file}] Vervang ${match} -> ${targetUrl}`);
                fileChanged = true;
                totalChanges++;
                return targetUrl;
            } else {
                console.warn(`   ⚠️  [${file}] Geen live URL gevonden voor ${match}`);
                return match;
            }
        });

        if (fileChanged && !dryRun) {
            fs.writeFileSync(filePath, newContent);
        }
    });

    if (totalChanges === 0) {
        console.log("✅ Geen localhost links gevonden die konden worden vervangen.");
    } else {
        console.log(`
🎉 Klaar! ${totalChanges} links bijgewerkt${dryRun ? ' (DRY RUN - geen wijzigingen opgeslagen)' : ''}.`);
    }
}

main().catch(err => console.error(err));
