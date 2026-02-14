/**
 * SecretManager.js
 * @description Manages GitHub Repository Secrets via the 'gh' CLI.
 * Bridge between local .env and GitHub Actions.
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

export class AthenaSecretManager {
    constructor(root) {
        this.root = root;
    }

    /**
     * Sync local .env variables to GitHub Repository Secrets
     * @param {string} repo - Format: "owner/repo"
     */
    async syncSecrets(repo) {
        if (!repo) throw new Error("Geen repository opgegeven voor secret sync.");

        const envPath = path.join(this.root, 'factory/.env');
        if (!fs.existsSync(envPath)) throw new Error(".env bestand niet gevonden.");

        const envContent = fs.readFileSync(envPath, 'utf8');
        const logs = [];

        // Mapping van .env keys naar GitHub Secret namen
        const mapping = {
            'GITHUB_PAT': 'ATHENA_DEPLOY_TOKEN',
            'GOOGLE_REFRESH_TOKEN': 'GOOGLE_REFRESH_TOKEN',
            'GOOGLE_CLIENT_ID': 'GOOGLE_CLIENT_ID',
            'GOOGLE_CLIENT_SECRET': 'GOOGLE_CLIENT_SECRET'
        };

        for (const [envKey, secretName] of Object.entries(mapping)) {
            const regex = new RegExp(`^${envKey}=(.*)$`, 'm');
            const match = envContent.match(regex);

            if (match && match[1].trim()) {
                const value = match[1].trim().replace(/['"]/g, ''); // strip quotes
                try {
                    console.log(`🔐 Syncing ${envKey} -> ${secretName}...`);
                    // We pushen de waarde via stdin naar 'gh secret set' voor veiligheid
                    execSync(`gh secret set ${secretName} --repo ${repo}`, {
                        input: value,
                        stdio: ['pipe', 'pipe', 'pipe']
                    });
                    logs.push(`✅ Secret '${secretName}' ingesteld op GitHub.`);
                } catch (e) {
                    logs.push(`❌ Fout bij instellen '${secretName}': ${e.message}`);
                }
            } else {
                logs.push(`⚠️  Veld '${envKey}' niet gevonden in .env, overgeslagen.`);
            }
        }

        return logs;
    }
}
