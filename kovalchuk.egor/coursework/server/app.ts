import express from 'express';
import type {ErrorRequestHandler} from 'express';
import {randomBytes, scryptSync, timingSafeEqual} from 'node:crypto';
import {readFile} from 'node:fs/promises';
import path from 'node:path';
import type {Good} from '../shared/types.js';
import {createOrderStore} from './store.js';
import {isRecord, validateOrder} from './validation.js';

interface AppOptions {
  ordersFile?: string;
  goodsFile?: string;
  username?: string;
  password?: string;
}
export async function createApp(options: AppOptions = {}) {
  const goods = JSON.parse(
    await readFile(
      options.goodsFile || path.resolve('server/data/goods.json'),
      'utf8',
    ),
  ) as Good[];
  const orders = createOrderStore(
    options.ordersFile ||
      process.env.ORDERS_FILE ||
      path.resolve('server/data/orders.json'),
  );
  const username = options.username || process.env.DEMO_LOGIN || 'egor';
  const password =
    options.password || process.env.DEMO_PASSWORD || 'GadgetHub2026!';
  const salt = randomBytes(16);
  const digest = scryptSync(password, salt, 64);
  const sessions = new Map<string, {expiresAt: number}>();
  const app = express();
  app.disable('x-powered-by');
  app.use(express.json({limit: '32kb'}));
  app.use('/api', (req, res, next) => {
    res.set('Cache-Control', 'no-store');
    const token = (req.headers.cookie || '')
      .split(';')
      .map((part) => part.trim())
      .find((part) => part.startsWith('gh_session='))
      ?.slice(11);
    const session = token ? sessions.get(token) : undefined;
    if (session && token && session.expiresAt > Date.now()) {
      req.user = {id: 'demo', username};
      req.sessionToken = token;
    } else if (session && token) {
      sessions.delete(token);
    }
    next();
  });
  app.get('/api/health', (req, res) => res.json({ok: true}));
  app.get('/api/session', (req, res) => res.json({user: req.user || null}));
  app.get('/api/featured', (req, res) =>
    res.json({goods: goods.filter((good) => good.isNew || good.isHit)}),
  );
  app.post('/api/login', (req, res) => {
    const body: unknown = req.body;
    const {login, password: submittedPassword} = isRecord(body) ? body : {};
    if (
      typeof login !== 'string' ||
      typeof submittedPassword !== 'string' ||
      !login.trim() ||
      !submittedPassword ||
      submittedPassword.length > 200
    ) {
      return res.status(400).json({message: 'Заполните обязательные поля.'});
    }
    if (
      login.trim() !== username ||
      !timingSafeEqual(scryptSync(submittedPassword, salt, 64), digest)
    ) {
      return res.status(401).json({
        message:
          'Такого пользователя нет, возможно неправильный логин или пароль — проверьте данные.',
      });
    }
    if (req.sessionToken) {
      sessions.delete(req.sessionToken);
    }
    for (const [token, value] of sessions) {
      if (value.expiresAt <= Date.now()) {
        sessions.delete(token);
      }
    }
    const token = randomBytes(32).toString('hex');
    sessions.set(token, {expiresAt: Date.now() + 8 * 60 * 60 * 1000});
    res.cookie('gh_session', token, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 8 * 60 * 60 * 1000,
      path: '/api',
    });
    return res.json({user: {id: 'demo', username}});
  });
  app.post('/api/logout', (req, res) => {
    if (req.sessionToken) {
      sessions.delete(req.sessionToken);
    }
    res.clearCookie('gh_session', {
      path: '/api',
      httpOnly: true,
      sameSite: 'lax',
    });
    res.json({ok: true});
  });
  app.use('/api', (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({message: 'Войдите в систему.'});
    }
    return next();
  });
  app.get('/api/goods', (req, res) => res.json({goods}));
  app.get('/api/orders', async (req, res) =>
    res.json({orders: await orders.list(req.user!.id)}),
  );
  app.post('/api/orders', async (req, res) => {
    const validated = validateOrder(req.body as unknown, goods);
    if ('errors' in validated) {
      return res
        .status(400)
        .json({message: 'Проверьте данные заказа.', errors: validated.errors});
    }
    const order = await orders.add({
      ...validated,
      userId: req.user!.id,
      total: validated.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
      ),
      quantity: validated.items.reduce((sum, item) => sum + item.quantity, 0),
    });
    return res.status(201).json({order});
  });
  app.use('/api', (req, res) =>
    res.status(404).json({message: 'Метод API не найден.'}),
  );
  const handleError: ErrorRequestHandler = (error: unknown, req, res, next) => {
    if (res.headersSent) {
      return next(error);
    }
    const details = isRecord(error) ? error : {};
    const status =
      details.type === 'entity.parse.failed'
        ? 400
        : details.status === 413
          ? 413
          : 500;
    return res.status(status).json({
      message:
        status === 400
          ? 'Некорректный JSON.'
          : 'Не удалось выполнить запрос. Повторите попытку.',
    });
  };
  app.use(handleError);
  return app;
}
