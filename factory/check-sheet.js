import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';

async function checkSheet() {
    const root = '/home/kareltestspecial/0-IT/2-Productie/athena/athena-x/factory';
    const auth = new google.auth.GoogleAuth({
        keyFile: path.join(root, 'service-account.json'),
        scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    const spreadsheetId = '1HrOUhMWGmY2A_eqsyMmBid1ChWNxtVA9TBwFPVNLxPk';

    try {
        const meta = await sheets.spreadsheets.get({ spreadsheetId });
        console.log("📊 GEVONDEN TABBLADEN:");
        meta.data.sheets.forEach(s => {
            console.log(`- ${s.properties.title} (ID: ${s.properties.sheetId}, Verborgen: ${s.properties.hidden || false})`);
        });

        const tabsToCheck = ['basis', 'site_settings', 'diensten_tarieven'];
        for (const tab of tabsToCheck) {
            console.log(`\n🔍 HEADERS VOOR '${tab}':`);
            const res = await sheets.spreadsheets.values.get({
                spreadsheetId,
                range: `${tab}!A1:Z1`,
            });
            console.log(JSON.stringify(res.data.values ? res.data.values[0] : "LEEG", null, 2));
        }
    } catch (e) {
        console.error("❌ FOUT BIJ TOEGANG TOT SHEET:", e.message);
        if (e.message.includes('403')) {
            console.log("\n💡 TIP: De Service Account 'athena-backend@athena-cms-factory.iam.gserviceaccount.com' heeft waarschijnlijk geen toegang. Deel de Google Sheet met dit emailadres!");
        }
    }
}

checkSheet();
