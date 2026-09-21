import assert from 'node:assert/strict';
import test from 'node:test';

import {products} from './products.js';

test('seed catalog contains all local product images with valid prices', () => {
  assert.equal(products.length, 32);
  assert.equal(
    new Set(products.map((product) => product.id)).size,
    products.length,
  );
  assert.ok(
    products.every((product) =>
      product.imagePath.endsWith(`image_${product.id}.png`),
    ),
  );
  assert.ok(products.every((product) => product.priceKopecks > 0));
});
