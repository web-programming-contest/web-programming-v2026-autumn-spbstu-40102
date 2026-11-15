from typing import Annotated

from fastapi import APIRouter, Query

from app.schemas.goods import GoodsFilters, GoodsPage, SortOption
from app.services.goods import get_filters, get_goods_page

router = APIRouter(prefix="/api/goods", tags=["goods"])


@router.get("", response_model=GoodsPage)
async def list_goods(
    sort: SortOption = SortOption.new,
    types: Annotated[list[str] | None, Query(alias="type")] = None,
    colors: Annotated[list[str] | None, Query(alias="color")] = None,
    price_min: Annotated[int | None, Query(ge=0)] = None,
    price_max: Annotated[int | None, Query(ge=0)] = None,
    page: Annotated[int, Query(ge=1)] = 1,
    limit: Annotated[int, Query(ge=1, le=50)] = 9,
):
    return await get_goods_page(sort, types, colors, price_min, price_max, page, limit)


@router.get("/filters", response_model=GoodsFilters)
async def goods_filters():
    return await get_filters()
