import {pool} from '../db/pool.js';

const productSelect = `
  SELECT
    id,
    name,
    image_path AS "imagePath",
    price_kopecks AS "priceKopecks",
    rating::float AS rating,
    category,
    color,
    description,
    specifications,
    is_new AS "isNew",
    is_hit AS "isHit",
    popularity
  FROM products
`;

export const listProducts = async () => {
  const {rows} = await pool.query(`${productSelect} ORDER BY id`);
  return rows;
};

export const findProductsByIds = async (client, ids) => {
  const {rows} = await client.query(
    `${productSelect} WHERE id = ANY($1::int[]) FOR SHARE`,
    [ids],
  );

  return rows;
};
