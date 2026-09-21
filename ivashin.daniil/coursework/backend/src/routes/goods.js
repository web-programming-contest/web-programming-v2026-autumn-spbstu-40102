import {Router} from 'express';

import {getGoods} from '../controllers/goods.js';

export const goodsRouter = Router();

goodsRouter.get('/goods', getGoods);
