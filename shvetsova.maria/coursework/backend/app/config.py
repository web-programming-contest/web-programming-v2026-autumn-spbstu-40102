import os
from dataclasses import dataclass, field
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent


@dataclass(frozen=True)
class Settings:
    client_origin: str = os.getenv("CLIENT_ORIGIN", "http://localhost:3000")
    session_secret: str = os.getenv("SESSION_SECRET", "gadget-hub-dev-secret")
    session_cookie: str = "gh_session"
    data_dir: Path = field(default=BASE_DIR / "data")
    static_dir: Path = field(default=BASE_DIR / "static")


settings = Settings()
