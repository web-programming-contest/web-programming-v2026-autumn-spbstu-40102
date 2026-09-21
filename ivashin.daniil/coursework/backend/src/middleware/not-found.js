import {HttpError} from '../utils/http-error.js';

export const notFound = (request, response, next) => {
  next(
    new HttpError(
      404,
      'NOT_FOUND',
      `Route ${request.method} ${request.path} was not found`,
    ),
  );
};
