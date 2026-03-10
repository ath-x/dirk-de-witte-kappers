/**
 * @file batch-upgrade-multiverse.js
 * @description Updates the GitHub Actions deployment workflow for all existing sites to support the dynamic Multiverse logic.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '../..');
const SITES_DIR = path.join(ROOT, 'sites');
const TEMPLATE_YAML = path.join(ROOT, 'factory/2-templates/config/deploy.yml');

async function upgradeSites() {
    console.log("🚀 Starting Batch Multiverse Upgrade...");

    if (!fs.existsSync(TEMPLATE_YAML)) {
        console.error(`❌ Template not found at: ${TEMPLATE_YAML}`);
        return;
    }

    const newYamlContent = fs.readFileSync(TEMPLATE_YAML, 'utf8');
    const sites = fs.readdirSync(SITES_DIR).filter(f => 
        fs.statSync(path.join(SITES_DIR, f)).isDirectory() && !f.startsWith('.')
    );

    console.log(`🔍 Found ${sites.length} sites to check.`);

    let updatedCount = 0;

    for (const site of sites) {
        const workflowDir = path.join(SITES_DIR, site, '.github/workflows');
        const deployYaml = path.join(workflowDir, 'deploy.yml');

        if (fs.existsSync(deployYaml)) {
            console.log(`   📦 Updating ${site}...`);
            if (!fs.existsSync(workflowDir)) fs.mkdirSync(workflowDir, { recursive: true });
            
            fs.writeFileSync(deployYaml, newYamlContent);
            updatedCount++;
        } else {
            console.log(`   ⏩ Skipping ${site} (no existing deploy.yml)`);
        }
    }

    console.log(`\n✅ Upgrade completed! ${updatedCount} sites updated to Multiverse logic.`);
}

upgradeSites();
