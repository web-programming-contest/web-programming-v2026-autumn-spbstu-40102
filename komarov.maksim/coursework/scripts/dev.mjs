import {spawn} from 'node:child_process';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const args = process.argv.slice(2);
const port = args.includes('--port')
  ? args[args.indexOf('--port') + 1]
  : '3000';
const host = args.includes('--host')
  ? args[args.indexOf('--host') + 1]
  : 'localhost';
const executable =
  process.platform === 'win32' ? '.dev-server.exe' : '.dev-server';
// Optional local toolchain override; this file is excluded from the deliverable.
try {
  const local = JSON.parse(
    readFileSync(new URL('../.dev.local.json', import.meta.url)),
  );
  if (local.go && !process.env.GO_BINARY) {
    process.env.GO_BINARY = local.go;
  }
} catch {
  // Локальная настройка компилятора необязательна.
}
const children = [];
let stopping = false;
function stop(code = 0) {
  if (stopping) {
    return;
  }
  stopping = true;
  for (const child of children) {
    child.kill('SIGTERM');
  }
  process.exitCode = code;
}
function launch(command, childArgs, directory) {
  const child = spawn(command, childArgs, {
    cwd: `${root}/${directory}`,
    stdio: 'inherit',
    env: process.env,
  });
  children.push(child);
  child.on('error', (err) => {
    console.error(`Не удалось запустить ${command}: ${err.message}`);
    stop(1);
  });
  child.on('exit', (code, signal) => {
    if (!stopping) {
      stop(signal ? 1 : (code ?? 1));
    }
  });
  return child;
}
process.on('SIGINT', () => stop());
process.on('SIGTERM', () => stop());
const compiler = spawn(
  process.env.GO_BINARY || 'go',
  ['build', '-buildvcs=false', '-o', `../${executable}`, './cmd/server'],
  {
    cwd: `${root}/backend`,
    stdio: 'inherit',
    env: process.env,
  },
);
children.push(compiler);
compiler.on('error', (err) => {
  console.error(`Установите Go 1.24+: ${err.message}`);
  stop(1);
});
compiler.on('exit', (code) => {
  if (stopping) {
    return;
  }
  if (code !== 0) {
    return stop(code || 1);
  }
  launch(`${root}/${executable}`, [], 'backend');
  launch(
    process.execPath,
    [
      'node_modules/vite/bin/vite.js',
      '--host',
      host,
      '--port',
      port,
      '--strictPort',
    ],
    'frontend',
  );
});
