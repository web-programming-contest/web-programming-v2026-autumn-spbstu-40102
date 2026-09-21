import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

import {pool} from './pool.js';

const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
const migrationPath = path.resolve(
  currentDirectory,
  '../../migrations/001-init.sql',
);

try {
  const sql = await fs.readFile(migrationPath, 'utf8');
  await pool.query(sql);
  console.log('Database migration completed.');
} finally {
  await pool.end();
}
