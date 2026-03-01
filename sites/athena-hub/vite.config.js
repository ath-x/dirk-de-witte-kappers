import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import fs from 'fs';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'athena-api-middleware',
      configureServer(server) {
        server.middlewares.use(async (req, res, next) => {
          if (req.url.includes('/__athena/update-json') && req.method === 'POST') {
            let body = '';
            req.on('data', chunk => { body += chunk.toString(); });
            req.on('end', () => {
              try {
                const data = JSON.parse(body);
                const { file, index, key, value } = data;
                const dataDir = path.resolve(__dirname, 'src/data');
                const filePath = path.join(dataDir, `${file}.json`);
                
                if (fs.existsSync(filePath)) {
                  const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
                  if (Array.isArray(content)) content[index || 0][key] = value;
                  else content[key] = value;
                  fs.writeFileSync(filePath, JSON.stringify(content, null, 2));
                  
                  // v8: RE-AGGREGATE ALL DATA
                  console.log(`📦 [Athena API] Re-aggregating all_data.json...`);
                  const allData = {};
                  const dataFiles = fs.readdirSync(dataDir).filter(f => f.endsWith('.json') && f !== 'all_data.json');
                  for (const f of dataFiles) {
                    allData[f.replace('.json', '')] = JSON.parse(fs.readFileSync(path.join(dataDir, f), 'utf8'));
                  }
                  fs.writeFileSync(path.join(dataDir, 'all_data.json'), JSON.stringify(allData, null, 2));
                  
                  console.log(`✅ [Athena API] Persisted & Aggregated: ${file}.json`);
                  
                  res.setHeader('Access-Control-Allow-Origin', '*');
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ success: true }));
                } else {
                  res.statusCode = 404;
                  res.end('Not found');
                }
              } catch (e) {
                console.error('❌ [Athena API] Error:', e.message);
                res.statusCode = 500;
                res.end(e.message);
              }
            });
            return;
          }
          next();
        });
      }
    }
  ],
  base: './',
  server: {
    port: 6041,
    host: true,
    fs: { allow: ['..'] }
  }
});
