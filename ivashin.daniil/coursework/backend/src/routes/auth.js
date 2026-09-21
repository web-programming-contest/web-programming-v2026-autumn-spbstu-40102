import {Router} from 'express';

import {login, logout, me} from '../controllers/auth.js';
import {validateBody} from '../middleware/validate.js';
import {loginSchema} from '../validation/schemas.js';

export const authRouter = Router();

authRouter.post('/login', validateBody(loginSchema), login);
authRouter.post('/logout', logout);
authRouter.get('/me', me);
