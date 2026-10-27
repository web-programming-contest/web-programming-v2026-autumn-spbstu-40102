import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp, readFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {createApp} from '../server/app.ts';

test('REST API: session, validation, authoritative prices, durable and concurrent orders', async (context) => {
  const directory = await mkdtemp(path.join(tmpdir(), 'gadget-hub-test-'));
  const filename = path.join(directory, 'orders.json');
  const app = await createApp({ordersFile: filename});
  const server = app.listen(0, '127.0.0.1');
  await new Promise((resolve) => server.once('listening', resolve));
  context.after(() => new Promise((resolve) => server.close(resolve)));
  const base = `http://127.0.0.1:${server.address().port}/api`;
  let cookie = '';
  async function request(route, method = 'GET', body) {
    const response = await fetch(`${base}${route}`, {
      method,
      headers: {'Content-Type': 'application/json', Cookie: cookie},
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    const data = await response.json();
    return {response, data};
  }
  assert.equal((await request('/goods')).response.status, 401);
  assert.equal((await request('/orders')).response.status, 401);
  assert.ok((await request('/featured')).data.goods.length >= 6);
  assert.equal((await request('/session')).data.user, null);
  assert.equal(
    (await request('/login', 'POST', {login: '', password: ''})).response
      .status,
    400,
  );
  assert.equal(
    (await request('/login', 'POST', {login: 'egor', password: 'wrong'}))
      .response.status,
    401,
  );
  const login = await request('/login', 'POST', {
    login: 'egor',
    password: 'GadgetHub2026!',
  });
  assert.equal(login.response.status, 200);
  cookie = login.response.headers.get('set-cookie').split(';')[0];
  assert.match(login.response.headers.get('set-cookie'), /HttpOnly/i);
  assert.equal((await request('/session')).data.user.username, 'egor');
  const goods = (await request('/goods')).data.goods;
  assert.equal(goods.length, 41);
  const customer = {
    phone: '+7 (999) 123-45-67',
    email: '',
    delivery: 'pickup',
    address: '',
    payment: 'cash',
    packaging: false,
  };
  const payload = {
    requestId: 'test-request-0001',
    customer,
    items: [{id: 100, quantity: 2, price: 1}],
  };
  assert.equal(
    (
      await request('/orders', 'POST', {
        ...payload,
        customer: {...customer, phone: ''},
      })
    ).response.status,
    400,
  );
  assert.equal(
    (
      await request('/orders', 'POST', {
        ...payload,
        customer: {...customer, delivery: 'delivery', address: ''},
      })
    ).response.status,
    400,
  );
  assert.equal(
    (
      await request('/orders', 'POST', {
        ...payload,
        customer: {...customer, email: 'broken'},
      })
    ).response.status,
    400,
  );
  assert.equal(
    (await request('/orders', 'POST', {...payload, items: []})).response.status,
    400,
  );
  for (const quantity of [0, -1, 1.5, 100]) {
    assert.equal(
      (
        await request('/orders', 'POST', {
          ...payload,
          items: [{id: 100, quantity}],
        })
      ).response.status,
      400,
    );
  }
  assert.equal(
    (
      await request('/orders', 'POST', {
        ...payload,
        items: [{id: 99999, quantity: 1}],
      })
    ).response.status,
    400,
  );
  assert.equal(
    (
      await request('/orders', 'POST', {
        ...payload,
        items: [
          {id: 100, quantity: 1},
          {id: 100, quantity: 2},
        ],
      })
    ).response.status,
    400,
  );
  const checkout = await request('/orders', 'POST', payload);
  assert.equal(checkout.response.status, 201);
  assert.equal(
    checkout.data.order.total,
    goods.find((good) => good.id === 100).price * 2,
  );
  assert.equal(checkout.data.order.quantity, 2);
  const retried = await request('/orders', 'POST', payload);
  assert.equal(retried.data.order.id, checkout.data.order.id);
  assert.equal((await request('/orders')).data.orders.length, 1);
  const parallel = await Promise.all(
    Array.from({length: 6}, (_, index) =>
      request('/orders', 'POST', {
        ...payload,
        requestId: `parallel-request-${index}`,
        customer: {
          ...customer,
          delivery: 'delivery',
          address: 'Санкт-Петербург, Барочная, 7',
          payment: 'card',
          packaging: true,
        },
      }),
    ),
  );
  assert.equal(new Set(parallel.map((result) => result.data.order.id)).size, 6);
  assert.equal((await request('/orders')).data.orders.length, 7);
  const persisted = JSON.parse(await readFile(filename, 'utf8'));
  assert.equal(persisted.length, 7);
  assert.equal(persisted[6].customer.address, 'Санкт-Петербург, Барочная, 7');
  const restarted = await createApp({ordersFile: filename});
  const secondServer = restarted.listen(0, '127.0.0.1');
  await new Promise((resolve) => secondServer.once('listening', resolve));
  context.after(() => new Promise((resolve) => secondServer.close(resolve)));
  const secondBase = `http://127.0.0.1:${secondServer.address().port}/api`;
  const relogin = await fetch(`${secondBase}/login`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({login: 'egor', password: 'GadgetHub2026!'}),
  });
  const secondCookie = relogin.headers.get('set-cookie').split(';')[0];
  const history = await fetch(`${secondBase}/orders`, {
    headers: {Cookie: secondCookie},
  });
  assert.equal((await history.json()).orders.length, 7);
  assert.equal((await request('/logout', 'POST')).response.status, 200);
  assert.equal((await request('/session')).data.user, null);
  assert.equal((await request('/orders')).response.status, 401);
});
