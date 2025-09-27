const fs = require('fs');
const path = require('path');

function check(binName, pkgPath) {
  const p = path.join(pkgPath, 'node_modules', '.bin', binName);
  return fs.existsSync(p);
}

const root = process.cwd();
const backend = path.join(root, 'backend');
const dashboard = path.join(root, 'dashboard');

const nodemonOk = check('nodemon', backend);
const viteOk = check('vite', dashboard);

if (!nodemonOk || !viteOk) {
  console.error('\nMissing development binaries detected:');
  if (!nodemonOk) console.error('- nodemon (backend). Run `npm run install:all` from repo root.');
  if (!viteOk) console.error('- vite (dashboard). Run `npm run install:all` from repo root.');
  console.error('\nAfter installing, re-run `npm run dev`.');
  process.exit(1);
}

console.log('Dev dependency check passed.');
process.exit(0);
