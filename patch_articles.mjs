import fs from 'fs';
import path from 'path';

const main = () => {
  const dir = path.join(process.cwd(), 'public', 'images', 'articles');
  const files = fs.readdirSync(dir);

  let articlesTsPath = path.join(process.cwd(), 'src', 'lib', 'data', 'articles.ts');
  let content = fs.readFileSync(articlesTsPath, 'utf8');

  files.forEach(file => {
    const slug = file.split('.')[0];
    const imagePath = `/images/articles/${file}`;
    
    // Find where the slug is defined
    const slugRegex = new RegExp(`slug:\\s*"${slug}"[\\s\\S]*?coverGradient:\\s*{[^}]+},?`, 'g');
    
    content = content.replace(slugRegex, (match) => {
      if (match.includes('coverImage:')) return match; // already added
      return `${match}\n    coverImage: "${imagePath}",`;
    });
  });

  fs.writeFileSync(articlesTsPath, content);
  console.log('Patched articles.ts with cover images.');
};

main();
