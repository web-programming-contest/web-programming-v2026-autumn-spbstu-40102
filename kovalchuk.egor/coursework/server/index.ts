import {createApp} from './app.js';
const port = Number(process.env.API_PORT || 8080);
const app = await createApp();
const server = app.listen(port, '127.0.0.1', () =>
  process.stdout.write(`Gadget Hub API: http://127.0.0.1:${port}/api\n`),
);
server.on('error', (error) => {
  console.error(error.message);
  process.exitCode = 1;
});
for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => server.close());
}
