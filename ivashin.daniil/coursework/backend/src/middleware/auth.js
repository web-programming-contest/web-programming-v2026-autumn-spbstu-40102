import {HttpError} from '../utils/http-error.js';

export const requireAuth = (request, response, next) => {
  if (!request.session.userId) {
    next(new HttpError(401, 'UNAUTHORIZED', 'Authentication is required'));
    return;
  }

  next();
};
