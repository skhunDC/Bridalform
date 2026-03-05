const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const required = ['Code.gs', 'index.html', 'print.html', 'scripts.html', 'styles.html', 'appsscript.json'];
let ok = true;
for (const file of required) {
  const full = path.join(root, file);
  if (!fs.existsSync(full)) {
    console.error(`Missing required file: ${file}`);
    ok = false;
  }
}
if (!ok) process.exit(1);
console.log('Lint checks passed.');
