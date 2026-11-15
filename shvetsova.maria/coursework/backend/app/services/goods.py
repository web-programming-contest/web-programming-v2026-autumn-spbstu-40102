import math

from app.schemas.goods import SortOption
from app.storage.json_store import read_json

SORT_RULES = {
    SortOption.new: ("createdAt", True),
    SortOption.popular: ("popularity", True),
    SortOption.cheap: ("price", False),
    SortOption.expensive: ("price", True),
}


async def get_goods_page(
    sort: SortOption,
    types: list[str] | None,
    colors: list[str] | None,
    price_min: int | None,
    price_max: int | None,
    page: int,
    limit: int,
) -> dict:
    goods = await read_json("goods")

    if types:
        goods = [product for product in goods if product["type"] in types]
    if colors:
        goods = [product for product in goods if product["color"] in colors]
    if price_min is not None:
        goods = [product for product in goods if product["price"] >= price_min]
    if price_max is not None:
        goods = [product for product in goods if product["price"] <= price_max]

    field, reverse = SORT_RULES[sort]
    goods.sort(key=lambda product: product[field], reverse=reverse)

    total = len(goods)
    pages = max(1, math.ceil(total / limit))
    start = (page - 1) * limit

    return {
        "items": goods[start : start + limit],
        "total": total,
        "page": page,
        "pages": pages,
    }


async def get_filters() -> dict:
    goods = await read_json("goods")
    prices = [product["price"] for product in goods]
    return {
        "types": list(dict.fromkeys(product["type"] for product in goods)),
        "colors": list(dict.fromkeys(product["color"] for product in goods)),
        "minPrice": min(prices),
        "maxPrice": max(prices),
    }
