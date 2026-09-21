# Gadget Hub

Интернет-магазин гаджетов по курсовому заданию Web-разработки.

## Структура

- `frontend` — Vue 3 + Vite;
- `backend` — Node.js + Express;
- PostgreSQL — локальная база данных без Docker.

## Запуск backend

Создайте базу `gadget_hub`, скопируйте `backend/env.example` в `.env` и укажите
пароль PostgreSQL.

```bash
cd backend
npm install
npm run db:migrate
npm run db:seed
npm run dev
```

## Запуск frontend

```bash
cd frontend
npm install
npm run dev
```

Демонстрационный пользователь задаётся переменными `SEED_USER_LOGIN` и
`SEED_USER_PASSWORD` в `.env`.
