import asyncio
import json

import aiofiles

from app.config import settings

write_lock = asyncio.Lock()


async def read_json(name: str):
    path = settings.data_dir / f"{name}.json"
    async with aiofiles.open(path, encoding="utf-8") as file:
        content = await file.read()
    return json.loads(content)


async def write_json(name: str, data) -> None:
    path = settings.data_dir / f"{name}.json"
    content = json.dumps(data, ensure_ascii=False, indent=2)
    async with aiofiles.open(path, "w", encoding="utf-8") as file:
        await file.write(content)
