const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Use git ls-files or just a simple recursive function to find all files
function getAllFiles(dirPath, arrayOfFiles) {
  const files = fs.readdirSync(dirPath);

  arrayOfFiles = arrayOfFiles || [];

  files.forEach(function(file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      if (file !== 'node_modules' && file !== '.git' && file !== 'dist' && file !== 'generated') {
        arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
      }
    } else {
      if (/\.(tsx|ts|jsx|js|css|html|sql|md)$/.test(file)) {
        arrayOfFiles.push(path.join(dirPath, "/", file));
      }
    }
  });

  return arrayOfFiles;
}

const files = getAllFiles('e:/code/vite-react/vite-react');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;

  // Replace @Author: taotao
  content = content.replace(/@Author:\s*taotao/gi, '@Author: Random Glow');
  // Replace @LastEditors: taotao
  content = content.replace(/@LastEditors:\s*taotao/gi, '@LastEditors: Random Glow');
  
  // Replace author: 'Admin'
  content = content.replace(/author:\s*['"]Admin['"]/g, "author: 'Random Glow'");
  // Replace author: 'taotao'
  content = content.replace(/author:\s*['"]taotao['"]/gi, "author: 'Random Glow'");

  // Replace "TAO" or 'TAO'
  content = content.replace(/['"]TAO['"]/g, '"Random Glow"');
  content = content.replace(/\|\s*TAO/g, '| Random Glow');
  content = content.replace(/>TAO</g, '>Random Glow<');
  content = content.replace(/title\s*=\s*"TAO"/g, 'title="Random Glow"');

  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated: ${file}`);
  }
});
