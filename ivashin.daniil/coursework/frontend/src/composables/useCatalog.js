import {computed, onMounted, reactive, ref, watch} from 'vue';

import {request} from '../api/client.js';

export const useCatalog = () => {
  const products = ref([]);
  const loading = ref(true);
  const error = ref('');
  const page = ref(1);
  const pageSize = 9;
  const sortMode = ref('new');
  const priceBounds = reactive({min: 0, max: 100000});
  const draft = reactive({min: 0, max: 100000, categories: [], colors: []});
  const applied = ref({min: 0, max: 100000, categories: [], colors: []});

  const categories = computed(() =>
    [...new Set(products.value.map((product) => product.category))].sort(),
  );
  const colors = computed(() =>
    [...new Set(products.value.map((product) => product.color))].sort(),
  );

  const filteredProducts = computed(() => {
    const result = products.value.filter((product) => {
      const categoryMatches =
        !applied.value.categories.length ||
        applied.value.categories.includes(product.category);
      const colorMatches =
        !applied.value.colors.length ||
        applied.value.colors.includes(product.color);

      return (
        product.priceKopecks >= applied.value.min &&
        product.priceKopecks <= applied.value.max &&
        categoryMatches &&
        colorMatches
      );
    });

    return [...result].sort((first, second) => {
      if (sortMode.value === 'popular')
        return second.popularity - first.popularity;
      if (sortMode.value === 'price-asc')
        return first.priceKopecks - second.priceKopecks;
      if (sortMode.value === 'price-desc')
        return second.priceKopecks - first.priceKopecks;
      return Number(second.isNew) - Number(first.isNew) || second.id - first.id;
    });
  });

  const pageCount = computed(() =>
    Math.max(1, Math.ceil(filteredProducts.value.length / pageSize)),
  );
  const visibleProducts = computed(() =>
    filteredProducts.value.slice(
      (page.value - 1) * pageSize,
      page.value * pageSize,
    ),
  );
  const pageButtons = computed(() => {
    if (pageCount.value <= 3)
      return Array.from({length: pageCount.value}, (_, index) => index + 1);
    return [1, 2, 3, '…', pageCount.value];
  });

  const syncBounds = () => {
    const values = products.value.map((product) => product.priceKopecks);
    priceBounds.min = Math.min(...values);
    priceBounds.max = Math.max(...values);
    draft.min = priceBounds.min;
    draft.max = priceBounds.max;
    applied.value = {
      min: priceBounds.min,
      max: priceBounds.max,
      categories: [],
      colors: [],
    };
  };

  const applyFilters = () => {
    applied.value = {
      min: draft.min,
      max: draft.max,
      categories: [...draft.categories],
      colors: [...draft.colors],
    };
    page.value = 1;
  };

  const resetFilters = () => {
    draft.min = priceBounds.min;
    draft.max = priceBounds.max;
    draft.categories = [];
    draft.colors = [];
    applyFilters();
  };

  const selectPage = (value) => {
    if (value !== '…') page.value = value;
  };

  watch(pageCount, (value) => {
    if (page.value > value) page.value = value;
  });

  onMounted(async () => {
    try {
      const result = await request('/goods');
      products.value = result.goods;
      syncBounds();
    } catch {
      error.value = 'Не удалось загрузить каталог';
    } finally {
      loading.value = false;
    }
  });

  return {
    products,
    loading,
    error,
    page,
    sortMode,
    priceBounds,
    draft,
    categories,
    colors,
    pageCount,
    visibleProducts,
    pageButtons,
    selectPage,
    applyFilters,
    resetFilters,
  };
};
