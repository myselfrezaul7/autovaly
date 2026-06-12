const fs = require('fs');
let c = fs.readFileSync('src/lib/data/articles.ts', 'utf8');

// The regex will find lines starting with spaces followed by coverImage: and remove all but the first one in a block.
// Let's just remove all lines with coverImage entirely, and then we will run patch_articles.mjs
c = c.split('\n').filter(line => !line.includes('coverImage:')).join('\n');

fs.writeFileSync('src/lib/data/articles.ts', c);
console.log('Removed all coverImages');
