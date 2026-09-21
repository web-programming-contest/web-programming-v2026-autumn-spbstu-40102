import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import session from 'express-session';
import connectPgSimple from 'connect-pg-simple';

import {config} from './config/env.js';
import {pool} from './db/pool.js';
import {errorHandler} from './middleware/error-handler.js';
import {notFound} from './middleware/not-found.js';
import {authRouter} from './routes/auth.js';
import {goodsRouter} from './routes/goods.js';
import {ordersRouter} from './routes/orders.js';

const PgSession = connectPgSimple(session);
export const app = express();

app.disable('x-powered-by');
app.use(helmet());
app.use(
  cors({
    origin: config.frontendOrigin,
    credentials: true,
  }),
);
app.use(express.json({limit: '100kb'}));
app.use(
  session({
    name: 'gadget.sid',
    store: new PgSession({
      pool,
      tableName: 'session',
      createTableIfMissing: false,
    }),
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: 'lax',
      secure: config.isProduction,
      maxAge: 1000 * 60 * 60 * 8,
    },
  }),
);

app.get('/health', (request, response) => response.json({status: 'ok'}));
app.use(authRouter);
app.use(goodsRouter);
app.use(ordersRouter);
app.use(notFound);
app.use(errorHandler);
