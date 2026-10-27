import test from 'node:test';
import assert from 'node:assert/strict';
import {selectGoods, paginationNumbers} from '../client/src/catalog.ts';

const goods = [
  {
    id: 1,
    price: 300,
    category: 'Часы',
    color: 'Синий',
    releasedAt: '2025-01-01',
    popularity: 10,
  },
  {
    id: 2,
    price: 100,
    category: 'Смартфоны',
    color: 'Белый',
    releasedAt: '2026-01-01',
    popularity: 30,
  },
  {
    id: 3,
    price: 200,
    category: 'Часы',
    color: 'Белый',
    releasedAt: '2024-01-01',
    popularity: 20,
  },
];
const defaults = {min: '', max: '', types: [], colors: []};
test('Filters intersect; price boundaries are inclusive; source is unchanged', () => {
  const snapshot = JSON.stringify(goods);
  const result = selectGoods(
    goods,
    {min: '100', max: '200', types: ['Часы'], colors: ['Белый']},
    {field: 'price', direction: 'asc'},
  );
  assert.deepEqual(
    result.map((item) => item.id),
    [3],
  );
  assert.equal(JSON.stringify(goods), snapshot);
});
test('Empty checkbox groups mean all products; sorting works in both directions', () => {
  for (const field of ['price', 'popularity', 'releasedAt']) {
    const ascending = selectGoods(goods, defaults, {field, direction: 'asc'});
    const descending = selectGoods(goods, defaults, {field, direction: 'desc'});
    assert.deepEqual(
      ascending.map((item) => item.id),
      descending.map((item) => item.id).reverse(),
    );
  }
  assert.equal(
    selectGoods(goods, defaults, {field: 'releasedAt', direction: 'desc'})[0]
      .id,
    2,
  );
});
test('No matches; pagination includes 1, 2, 3, ellipsis, last and selected page', () => {
  assert.deepEqual(
    selectGoods(
      goods,
      {...defaults, min: '1000'},
      {field: 'price', direction: 'asc'},
    ),
    [],
  );
  assert.deepEqual(paginationNumbers(5, 1), [1, 2, 3, 'ellipsis', 5]);
  assert.deepEqual(paginationNumbers(8, 6), [
    1,
    2,
    3,
    'ellipsis',
    6,
    'ellipsis',
    8,
  ]);
});
