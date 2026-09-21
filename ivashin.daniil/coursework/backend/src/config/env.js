import 'dotenv/config';

const required = (name, fallback) => {
  const value = process.env[name] || fallback;

  if (!value) {
    throw new Error(`Environment variable ${name} is required`);
  }

  return value;
};

export const config = {
  port: Number(process.env.PORT || 8080),
  databaseUrl: required('DATABASE_URL'),
  sessionSecret: required('SESSION_SECRET'),
  frontendOrigin: required('FRONTEND_ORIGIN', 'http://localhost:3000'),
  seedUserLogin: required('SEED_USER_LOGIN', 'demo'),
  seedUserPassword: required('SEED_USER_PASSWORD', 'demo1234'),
  isProduction: process.env.NODE_ENV === 'production',
};
