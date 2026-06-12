import fs from 'fs';
import path from 'path';
import https from 'https';

const articles = [
  { slug: "tesla-model-y-refresh", wikiTitle: "Tesla_Model_Y" },
  { slug: "bmw-m5-touring-review", wikiTitle: "BMW_M5" },
  { slug: "byd-europe-ev-market", wikiTitle: "BYD_Seal" },
  { slug: "porsche-taycan-vs-audi-etron-gt", wikiTitle: "Porsche_Taycan" },
  { slug: "xiaomi-su7-ultra-review", wikiTitle: "Xiaomi_SU7" },
  { slug: "ford-maverick-hybrid-review", wikiTitle: "Ford_Maverick_(2022)" },
  { slug: "hyundai-ioniq-9-review", wikiTitle: "Hyundai_Ioniq_9" },
  { slug: "rivian-r2-pre-orders", wikiTitle: "Rivian_R2" },
  { slug: "solid-state-batteries-explained", wikiTitle: "Solid-state_battery" },
  { slug: "best-evs-under-40k", wikiTitle: "Volvo_EX30" },
  { slug: "porsche-911-hybrid-deep-dive", wikiTitle: "Porsche_911" },
  { slug: "lucid-gravity-first-look", wikiTitle: "Lucid_Gravity" },
  { slug: "manual-transmission-sales-rebound", wikiTitle: "Manual_transmission" },
  { slug: "tesla-fsd-v13-review", wikiTitle: "Tesla_Autopilot" },
  { slug: "europe-tariffs-chinese-evs", wikiTitle: "BYD_Atto_3" }
];

const fetchJson = (url) => {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'AutovalyBot/1.0 (test@example.com)' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch (e) { reject(e); }
      });
    }).on('error', reject);
  });
};

import { execSync } from 'child_process';

const downloadImage = async (url, filepath) => {
  try {
    execSync(`curl -sL "${url}" -o "${filepath}" -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"`);
  } catch (err) {
    throw new Error(`Curl failed: ${err.message}`);
  }
};

const main = async () => {
  const dir = path.join(process.cwd(), 'public', 'images', 'articles');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  for (const article of articles) {
    console.log(`Fetching Wiki for: ${article.wikiTitle}`);
    try {
      const apiUrl = `https://en.wikipedia.org/w/api.php?action=query&titles=${article.wikiTitle}&prop=pageimages&format=json&pithumbsize=1000`;
      const data = await fetchJson(apiUrl);
      const pages = data.query.pages;
      const pageId = Object.keys(pages)[0];
      
      if (pageId !== "-1" && pages[pageId].thumbnail) {
        const imgUrl = pages[pageId].thumbnail.source;
        console.log(`Found image URL: ${imgUrl}`);
        
        const ext = imgUrl.split('.').pop().split('?')[0].toLowerCase();
        const safeExt = ['jpg', 'jpeg', 'png', 'webp', 'svg'].includes(ext) ? ext : 'jpg';
        const filename = `${article.slug}.${safeExt}`;
        const filepath = path.join(dir, filename);
        
        await downloadImage(imgUrl, filepath);
        console.log(`Downloaded ${filename}`);
      } else {
        console.log(`No image found for ${article.wikiTitle}`);
      }
    } catch (err) {
      console.error(`Error for ${article.wikiTitle}:`, err.message);
    }
    await new Promise(r => setTimeout(r, 500));
  }
};

main();
