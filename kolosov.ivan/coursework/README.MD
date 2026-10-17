# Gadget Hub

Интернет-магазин гаджетов по курсовому заданию Web-разработки.

## Структура

- `frontend` — React;
- `backend` — Spring Boot;
- `database` - PostgreSQL;
- `сборка` - Docker;

## Запуск проекта

```bash
docker compose up -d --build
```

## Отдельный запуск backend + db и frontenda

```bash
docker compose up -d --build backend postgres
cd frontend
npm install
npm run dev
```

## Данные единственного пользователя для входа в систему
- `login` — admin;
- `password` — admin;
