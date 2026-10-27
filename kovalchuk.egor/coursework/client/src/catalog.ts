interface SortableGood {
  id: number;
  price: number;
  category: string;
  color: string;
  releasedAt: string;
  popularity: number;
}
export interface Filters {
  min: string | number;
  max: string | number;
  types: string[];
  colors: string[];
}
export interface Sort {
  field: 'releasedAt' | 'price' | 'popularity';
  direction: 'asc' | 'desc';
  label?: string;
}
export function selectGoods<T extends SortableGood>(
  goods: T[],
  filters: Filters,
  sort: Sort,
): T[] {
  const selected = goods.filter(
    (good) =>
      (filters.min === '' || good.price >= Number(filters.min)) &&
      (filters.max === '' || good.price <= Number(filters.max)) &&
      (filters.types.length === 0 || filters.types.includes(good.category)) &&
      (filters.colors.length === 0 || filters.colors.includes(good.color)),
  );
  const direction = sort.direction === 'asc' ? 1 : -1;
  return selected.sort((a, b) => {
    const first =
      sort.field === 'releasedAt' ? Date.parse(a.releasedAt) : a[sort.field];
    const second =
      sort.field === 'releasedAt' ? Date.parse(b.releasedAt) : b[sort.field];
    return (first - second) * direction || a.id - b.id;
  });
}
export function paginationNumbers(
  total: number,
  current: number,
): (number | 'ellipsis')[] {
  const pages = [...new Set([1, 2, 3, current, total])]
    .filter((page) => page >= 1 && page <= total)
    .sort((a, b) => a - b);
  return pages.flatMap<number | 'ellipsis'>((page, index) =>
    index > 0 && page - pages[index - 1] > 1 ? ['ellipsis', page] : [page],
  );
}
