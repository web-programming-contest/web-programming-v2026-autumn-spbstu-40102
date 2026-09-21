import {withTransaction} from '../db/pool.js';
import {findProductsByIds} from './products.js';

export const createOrder = async (userId, input) =>
  withTransaction(async (client) => {
    const quantities = new Map();

    for (const item of input.items) {
      quantities.set(
        item.productId,
        (quantities.get(item.productId) || 0) + item.quantity,
      );
    }

    const ids = [...quantities.keys()];

    if ([...quantities.values()].some((quantity) => quantity > 99)) {
      const error = new Error('Quantity per product must not exceed 99');
      error.status = 400;
      error.code = 'QUANTITY_TOO_LARGE';
      throw error;
    }

    const products = await findProductsByIds(client, ids);

    if (products.length !== ids.length) {
      const found = new Set(products.map((product) => product.id));
      const missing = ids.filter((id) => !found.has(id));
      const error = new Error(`Products not found: ${missing.join(', ')}`);
      error.status = 400;
      error.code = 'PRODUCT_NOT_FOUND';
      throw error;
    }

    const productMap = new Map(
      products.map((product) => [product.id, product]),
    );
    const totalKopecks = ids.reduce(
      (total, id) =>
        total + productMap.get(id).priceKopecks * quantities.get(id),
      0,
    );

    if (totalKopecks > 2147483647) {
      const error = new Error('Order total exceeds the allowed limit');
      error.status = 400;
      error.code = 'ORDER_TOTAL_TOO_LARGE';
      throw error;
    }

    const orderResult = await client.query(
      `INSERT INTO orders (
        user_id, phone, email, delivery_type, address, payment_method, packaging, total_kopecks
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id, created_at AS "createdAt", total_kopecks AS "totalKopecks"`,
      [
        userId,
        input.phone,
        input.email || null,
        input.deliveryType,
        input.deliveryType === 'delivery' ? input.address : null,
        input.paymentMethod,
        input.packaging,
        totalKopecks,
      ],
    );

    const order = orderResult.rows[0];

    for (const id of ids) {
      await client.query(
        `INSERT INTO order_items (order_id, product_id, quantity, unit_price_kopecks)
         VALUES ($1, $2, $3, $4)`,
        [order.id, id, quantities.get(id), productMap.get(id).priceKopecks],
      );
    }

    return {
      ...order,
      itemCount: ids.reduce((count, id) => count + quantities.get(id), 0),
    };
  });

export const listOrdersForUser = async (userId) => {
  const {rows} = await import('../db/pool.js').then(({pool}) =>
    pool.query(
      `SELECT
        id,
        created_at AS "createdAt",
        total_kopecks AS "totalKopecks",
        COALESCE(SUM(order_items.quantity), 0)::int AS "itemCount"
      FROM orders
      LEFT JOIN order_items ON order_items.order_id = orders.id
      WHERE user_id = $1
      GROUP BY orders.id
      ORDER BY created_at DESC`,
      [userId],
    ),
  );

  return rows;
};
