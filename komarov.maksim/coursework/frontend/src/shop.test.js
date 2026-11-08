import test from 'node:test';
import assert from 'node:assert/strict';
import {
  parseCart,
  selectProducts,
  validateCheckout,
  productWord,
} from './shop.js';

const products = [
  {
    id: 1,
    price: 100,
    category: 'Часы',
    color: 'Синий',
    isNew: false,
    popularity: 10,
    releaseDate: '2024-01-01',
    catalogOrder: 1,
  },
  {
    id: 2,
    price: 90,
    category: 'Телефоны',
    color: 'Синий',
    isNew: true,
    popularity: 20,
    releaseDate: '2024-02-01',
    catalogOrder: 2,
  },
  {
    id: 3,
    price: 1000,
    category: 'Часы',
    color: 'Красный',
    isNew: true,
    popularity: 30,
    releaseDate: '2024-03-01',
    catalogOrder: 3,
  },
];
const filters = () => ({min: '', max: '', categories: [], colors: []});

test('filters combine price, category and color; empty checkboxes include all', () => {
  assert.equal(selectProducts(products, filters(), 'new').length, 3);
  const filtered = selectProducts(
    products,
    {min: '90', max: '100', categories: ['Часы'], colors: ['Синий']},
    'new',
  );
  assert.deepEqual(
    filtered.map((p) => p.id),
    [1],
  );
  assert.deepEqual(
    selectProducts(products, {...filters(), min: '1001'}, 'new'),
    [],
  );
});

test('prices sort numerically; new goods are first; source is unchanged', () => {
  assert.deepEqual(
    selectProducts(products, filters(), 'cheap').map((p) => p.id),
    [2, 1, 3],
  );
  assert.deepEqual(
    selectProducts(products, filters(), 'expensive').map((p) => p.id),
    [3, 1, 2],
  );
  assert.deepEqual(
    selectProducts(products, filters(), 'new').map((p) => p.id),
    [3, 2, 1],
  );
  assert.deepEqual(
    selectProducts(products, filters(), 'unpopular').map((p) => p.id),
    [1, 2, 3],
  );
  assert.deepEqual(
    products.map((p) => p.id),
    [1, 2, 3],
  );
});

test('corrupted or manipulated localStorage cannot restore invalid quantities', () => {
  assert.deepEqual(parseCart('broken'), {});
  assert.deepEqual(parseCart('null'), {});
  assert.deepEqual(parseCart('[]'), {});
  assert.deepEqual(
    parseCart(
      '{"1":2,"2":0,"3":-1,"4":100,"5":"2","6":1.5,"-1":2,"__proto__":3}',
    ),
    {1: 2},
  );
});

test('checkout requires address only for delivery; email is optional', () => {
  const valid = {
    phone: '+7 (999) 123-45-67',
    email: '',
    delivery: 'pickup',
    address: '',
    payment: 'card',
  };
  assert.deepEqual(validateCheckout(valid), {});
  assert.ok(validateCheckout({...valid, delivery: 'delivery'}).address);
  assert.ok(validateCheckout({...valid, phone: '123'}).phone);
  assert.ok(validateCheckout({...valid, email: 'invalid@'}).email);
  assert.ok(validateCheckout({...valid, payment: ''}).payment);
});

test('Russian quantity labels handle teens and compound numbers', () => {
  assert.deepEqual([1, 2, 5, 11, 21, 22, 114].map(productWord), [
    'товар',
    'товара',
    'товаров',
    'товаров',
    'товар',
    'товара',
    'товаров',
  ]);
});
