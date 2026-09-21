import {listProducts} from '../repositories/products.js';

export const getGoods = async (request, response) => {
  response.json({goods: await listProducts()});
};
