const https = require('https');
const fs = require('fs');

const endpoints = [
  { name: 'Home', url: 'https://nav.eooce.com/api/cards/1' },
  { name: 'Ai-stuff', url: 'https://nav.eooce.com/api/cards/2' },
  { name: 'Cloud', url: 'https://nav.eooce.com/api/cards/3' },
  { name: 'Container - Game Server', url: 'https://nav.eooce.com/api/cards/8?subMenuId=1' },
  { name: 'Software - Proxy', url: 'https://nav.eooce.com/api/cards/4?subMenuId=5' },
  { name: 'Software - Macos', url: 'https://nav.eooce.com/api/cards/4?subMenuId=3' },
  { name: 'Tools - Free SMS', url: 'https://nav.eooce.com/api/cards/5?subMenuId=6' },
  { name: 'Tools - Other', url: 'https://nav.eooce.com/api/cards/5?subMenuId=7' },
  { name: 'Mail & Domain', url: 'https://nav.eooce.com/api/cards/6' },
  { name: 'Dev', url: 'https://nav.eooce.com/api/cards/11' },
];

const results = [];

function fetchUrl(endpoint) {
  return new Promise((resolve, reject) => {
    https.get(endpoint.url, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve({ name: endpoint.name, items: json });
        } catch (e) {
          console.error(`Error parsing JSON for ${endpoint.name}:`, e);
          resolve({ name: endpoint.name, items: [] });
        }
      });
    }).on('error', (err) => {
      console.error(`Error fetching ${endpoint.name}:`, err);
      resolve({ name: endpoint.name, items: [] });
    });
  });
}

async function fetchAll() {
  for (const endpoint of endpoints) {
    console.log(`Fetching ${endpoint.name}...`);
    const result = await fetchUrl(endpoint);
    results.push(result);
  }
  fs.writeFileSync('nav_data.json', JSON.stringify(results, null, 2));
  console.log('Done! Saved to nav_data.json');
}

fetchAll();
