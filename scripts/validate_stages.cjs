const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, '..', 'public');
const files = fs.readdirSync(dir).filter(f => f.startsWith('stage_')).sort();
let exitCode = 0;
for (const f of files) {
  const p = path.join(dir, f);
  const s = fs.readFileSync(p, 'utf8');
  try {
    JSON.parse(s);
    console.log(f, 'OK');
  } catch (e) {
    console.log(f, 'ERROR', e.message);
    exitCode = 1;
  }
}
process.exit(exitCode);
