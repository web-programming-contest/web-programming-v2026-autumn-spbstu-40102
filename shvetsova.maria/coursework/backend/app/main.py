from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from starlette.middleware.sessions import SessionMiddleware

from app.config import settings
from app.routers import auth, goods, orders

app = FastAPI(title="Gadget Hub API")

app.add_middleware(
    SessionMiddleware,
    secret_key=settings.session_secret,
    session_cookie=settings.session_cookie,
    same_site="lax",
    https_only=False,
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.client_origin],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(goods.router)
app.include_router(orders.router)

app.mount("/images", StaticFiles(directory=settings.static_dir / "images"), name="images")


@app.get("/api/health")
async def health() -> dict[str, str]:
    return {"status": "ok"}
