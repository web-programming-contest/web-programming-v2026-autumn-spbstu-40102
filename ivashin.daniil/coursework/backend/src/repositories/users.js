import {pool} from '../db/pool.js';

export const findUserByUsername = async (username) => {
  const {rows} = await pool.query(
    'SELECT id, username, password_hash AS "passwordHash" FROM users WHERE username = $1',
    [username],
  );

  return rows[0] || null;
};

export const upsertUser = async (username, passwordHash) => {
  const {rows} = await pool.query(
    `INSERT INTO users (username, password_hash)
     VALUES ($1, $2)
     ON CONFLICT (username) DO UPDATE SET password_hash = EXCLUDED.password_hash
     RETURNING id, username`,
    [username, passwordHash],
  );

  return rows[0];
};
