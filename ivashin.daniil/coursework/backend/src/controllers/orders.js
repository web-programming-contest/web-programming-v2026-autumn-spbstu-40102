import {createOrder, listOrdersForUser} from '../repositories/orders.js';

export const getOrders = async (request, response) => {
  response.json({orders: await listOrdersForUser(request.session.userId)});
};

export const postOrder = async (request, response) => {
  const order = await createOrder(request.session.userId, request.body);
  response.status(201).json({order});
};
