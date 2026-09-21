import {findUserByUsername} from '../repositories/users.js';
import {verifyPassword} from '../services/password.js';
import {HttpError} from '../utils/http-error.js';

const regenerateSession = (request) =>
  new Promise((resolve, reject) => {
    request.session.regenerate((error) => (error ? reject(error) : resolve()));
  });

export const login = async (request, response) => {
  const user = await findUserByUsername(request.body.username);

  if (
    !user ||
    !(await verifyPassword(request.body.password, user.passwordHash))
  ) {
    throw new HttpError(
      401,
      'INVALID_CREDENTIALS',
      'Invalid username or password',
    );
  }

  await regenerateSession(request);
  request.session.userId = user.id;
  request.session.username = user.username;

  response.json({user: {id: user.id, username: user.username}});
};

export const me = (request, response) => {
  if (!request.session.userId) {
    response.json({user: null});
    return;
  }

  response.json({
    user: {id: request.session.userId, username: request.session.username},
  });
};

export const logout = async (request, response) => {
  if (!request.session) {
    response.status(204).end();
    return;
  }

  await new Promise((resolve, reject) => {
    request.session.destroy((error) => (error ? reject(error) : resolve()));
  });

  response.clearCookie('gadget.sid');
  response.status(204).end();
};
