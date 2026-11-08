from enum import Enum

from pydantic import BaseModel


class SortOption(str, Enum):
    new = "new"
    popular = "popular"
    cheap = "cheap"
    expensive = "expensive"


class Spec(BaseModel):
    name: str
    value: str


class Product(BaseModel):
    id: int
    name: str
    type: str
    color: str
    price: int
    rating: float | None
    isNew: bool
    isHit: bool
    popularity: int
    createdAt: str
    image: str
    description: str
    specs: list[Spec]


class GoodsPage(BaseModel):
    items: list[Product]
    total: int
    page: int
    pages: int


class GoodsFilters(BaseModel):
    types: list[str]
    colors: list[str]
    minPrice: int
    maxPrice: int
