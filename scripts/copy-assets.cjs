const fs = require('fs');
const path = require('path');

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

const sourceDirs = [
  path.resolve(__dirname, '..', 'public', 'assets', 'uploads'),
  path.resolve(__dirname, '..', 'attached_assets'),
];
const destDir = path.resolve(__dirname, '..', 'client', 'public', 'assets', 'uploads');

ensureDir(destDir);

sourceDirs.forEach((src) => {
  if (!fs.existsSync(src)) return;
  fs.readdirSync(src).forEach((file) => {
    const srcPath = path.join(src, file);
    const destPath = path.join(destDir, file);
    try {
      fs.copyFileSync(srcPath, destPath);
    } catch (err) {
      // ignore
    }
  });
});

console.log('copied assets to', destDir);
