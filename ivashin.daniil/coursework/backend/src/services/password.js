import {promisify} from 'node:util';
import crypto from 'node:crypto';

const scrypt = promisify(crypto.scrypt);
const KEY_LENGTH = 64;

export const hashPassword = async (password) => {
  const salt = crypto.randomBytes(16).toString('hex');
  const derivedKey = await scrypt(password, salt, KEY_LENGTH);

  return `scrypt:${salt}:${derivedKey.toString('hex')}`;
};

export const verifyPassword = async (password, storedHash) => {
  const [algorithm, salt, expectedHex] = storedHash.split(':');

  if (algorithm !== 'scrypt' || !salt || !expectedHex) {
    return false;
  }

  const expected = Buffer.from(expectedHex, 'hex');
  const actual = await scrypt(password, salt, expected.length);

  return (
    expected.length === actual.length &&
    crypto.timingSafeEqual(expected, actual)
  );
};
