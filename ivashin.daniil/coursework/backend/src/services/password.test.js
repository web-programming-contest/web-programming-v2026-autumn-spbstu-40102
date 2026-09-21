import assert from 'node:assert/strict';
import test from 'node:test';

import {hashPassword, verifyPassword} from './password.js';

test('password hashes can be verified without storing the plain password', async () => {
  const hash = await hashPassword('demo1234');

  assert.notEqual(hash, 'demo1234');
  assert.equal(await verifyPassword('demo1234', hash), true);
  assert.equal(await verifyPassword('wrong-password', hash), false);
});
