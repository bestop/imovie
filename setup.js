const {execSync} = require('child_process');
const path = require('path');
const fs = require('fs');

process.env.PATH = 'C:\\Program Files\\nodejs;' + process.env.PATH;

const cwd = __dirname;
console.log('CWD:', cwd);
console.log('package.json exists:', fs.existsSync(path.join(cwd, 'package.json')));
console.log('node_modules exists:', fs.existsSync(path.join(cwd, 'node_modules')));

try {
  console.log('Running npm install...');
  const out = execSync('npm.cmd install --loglevel verbose', {
    cwd: cwd,
    stdio: 'inherit',
    env: process.env,
    timeout: 120000
  });
  console.log('npm install completed');
  console.log('node_modules exists after install:', fs.existsSync(path.join(cwd, 'node_modules')));
} catch(e) {
  console.log('ERROR:', e.status, e.message);
  if (e.stderr) console.log('STDERR:', e.stderr.toString().substring(0, 500));
  if (e.stdout) console.log('STDOUT:', e.stdout.toString().substring(0, 500));
}
