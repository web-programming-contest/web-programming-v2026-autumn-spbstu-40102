# Gadget Hub

Интернет-магазин гаджетов. Фронтенд: React + Vite (порт 3000). Бекенд: Python +
FastAPI (порт 8080).

## Первый запуск

```bash
cd backend
python -m venv .venv
```

Активировать окружение:

- macOS / Linux: `source .venv/bin/activate`
- Windows (PowerShell): `.venv\Scripts\Activate.ps1`

```bash
pip install -r requirements.txt
cd ..
npm run install:all
npm run dev
```

- Сайт: http://localhost:3000
- Документация API: http://localhost:8080/docs

## Дальше каждый раз

Активировать окружение `backend/.venv` и выполнить `npm run dev` из корня
проекта.
