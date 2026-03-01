import fs from 'fs';
import path from 'path';

const logPath = path.join(process.cwd(), 'conductor/execution_log.md');
const command = process.argv[2];

if (command === 'ping') {
    const timestamp = new Date().toISOString();
    const pingMessage = `\n[PING] Agent: Task/Phase completed at ${timestamp}. Waiting for Lead Architect validation.\n`;
    
    try {
        fs.appendFileSync(logPath, pingMessage);
        console.log("🚀 Ping sent to Lead Architect via execution_log.md");
    } catch (err) {
        console.error("❌ Failed to send ping:", err.message);
    }
} else {
    console.log("Usage: node conductor/sync.js ping");
}
