import {Router} from 'express';

import {getOrders, postOrder} from '../controllers/orders.js';
import {requireAuth} from '../middleware/auth.js';
import {validateBody} from '../middleware/validate.js';
import {orderSchema} from '../validation/schemas.js';

export const ordersRouter = Router();

ordersRouter.get('/orders', requireAuth, getOrders);
ordersRouter.post('/orders', requireAuth, validateBody(orderSchema), postOrder);
