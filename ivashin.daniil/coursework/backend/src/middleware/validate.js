import {HttpError} from '../utils/http-error.js';

export const validateBody = (schema) => (request, response, next) => {
  const result = schema.safeParse(request.body);

  if (!result.success) {
    next(
      new HttpError(
        400,
        'VALIDATION_ERROR',
        'Request data is invalid',
        result.error.flatten(),
      ),
    );
    return;
  }

  request.body = result.data;
  next();
};
