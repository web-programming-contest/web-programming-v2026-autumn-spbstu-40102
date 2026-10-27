import {spawn} from 'node:child_process';
import {fileURLToPath} from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const production = process.argv.includes('--production');
const children = [];
let stopping = false;
function stop(code = 0) {
  if (stopping) {
    return;
  }
  stopping = true;
  children.forEach((child) => child.kill());
  process.exitCode = code;
}
for (const arguments_ of [
  production
    ? ['dist-server/server/index.js']
    : ['--import', 'tsx', 'server/index.ts'],
  [
    'node_modules/vite/bin/vite.js',
    ...(production ? ['preview'] : []),
    '--host',
    '127.0.0.1',
  ],
]) {
  const child = spawn(process.execPath, arguments_, {
    cwd: root,
    stdio: 'inherit',
    windowsHide: true,
  });
  children.push(child);
  child.on('error', (error) => {
    console.error(error.message);
    stop(1);
  });
  child.on('exit', (code) => {
    if (!stopping) {
      stop(code || 0);
    }
  });
}
process.on('SIGINT', () => stop());
process.on('SIGTERM', () => stop());
process.stdout.write(
  'Gadget Hub: http://127.0.0.1:3000 · API: http://127.0.0.1:8080/api\n',
);
