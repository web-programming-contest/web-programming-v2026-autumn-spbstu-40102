export const errorHandler = (error, request, response, next) => {
  const status = error.status || 500;
  const code = status >= 500 ? 'INTERNAL_ERROR' : error.code || 'REQUEST_ERROR';

  if (status >= 500) {
    console.error(error);
  }

  response.status(status).json({
    error: {
      code,
      message: status >= 500 ? 'Internal server error' : error.message,
      ...(error.details ? {details: error.details} : {}),
    },
  });
};
