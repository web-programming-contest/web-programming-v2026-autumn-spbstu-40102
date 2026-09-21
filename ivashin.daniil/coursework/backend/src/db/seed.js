import {pool} from './pool.js';
import {config} from '../config/env.js';
import {products} from '../data/products.js';
import {hashPassword} from '../services/password.js';
import {upsertUser} from '../repositories/users.js';

try {
  const passwordHash = await hashPassword(config.seedUserPassword);
  const user = await upsertUser(config.seedUserLogin, passwordHash);

  for (const product of products) {
    await pool.query(
      `INSERT INTO products (
        id, name, image_path, price_kopecks, rating, category, color,
        description, specifications, is_new, is_hit, popularity
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        image_path = EXCLUDED.image_path,
        price_kopecks = EXCLUDED.price_kopecks,
        rating = EXCLUDED.rating,
        category = EXCLUDED.category,
        color = EXCLUDED.color,
        description = EXCLUDED.description,
        specifications = EXCLUDED.specifications,
        is_new = EXCLUDED.is_new,
        is_hit = EXCLUDED.is_hit,
        popularity = EXCLUDED.popularity`,
      [
        product.id,
        product.name,
        product.imagePath,
        product.priceKopecks,
        product.rating,
        product.category,
        product.color,
        product.description,
        product.specifications,
        product.isNew,
        product.isHit,
        product.popularity,
      ],
    );
  }

  console.log(
    `Seed completed for user ${user.username} and ${products.length} products.`,
  );
} finally {
  await pool.end();
}
