<script setup lang="ts">
import { onMounted, ref } from "vue";
import { api } from "../api/client";
import type { Product } from "../api/models";
import ProductCard from "../components/ProductCard.vue";
import ProductModal from "../components/ProductModal.vue";
import PriceRange from "../components/PriceRange.vue";
type Filters = {
  types: string[];
  colors: string[];
  minPrice: number;
  maxPrice: number;
};
const filters = ref<Filters | null>(null),
  types = ref<string[]>([]),
  colors = ref<string[]>([]);
const min = ref(""),
  max = ref(""),
  sort = ref("newness"),
  direction = ref("desc"),
  page = ref(1);
const result = ref({ items: [] as Product[], totalPages: 0, totalItems: 0 }),
  loading = ref(false),
  filterError = ref(""),
  error = ref(""),
  selected = ref<Product | null>(null);
let revision = 0;
let applied = {
  minPrice: undefined as number | undefined,
  maxPrice: undefined as number | undefined,
  types: [] as string[],
  colors: [] as string[],
};
async function load() {
  const current = ++revision;
  loading.value = true;
  error.value = "";
  try {
    const data = await api.get<typeof result.value>("/goods", {
      ...applied,
      sort: sort.value,
      direction: direction.value,
      page: page.value,
    });
    if (current === revision) result.value = data;
  } catch (e) {
    if (current === revision)
      error.value =
        e instanceof Error ? e.message : "Не удалось загрузить каталог";
  } finally {
    if (current === revision) loading.value = false;
  }
}
function apply() {
  if (
    (min.value !== "" &&
      (!Number.isSafeInteger(Number(min.value)) || Number(min.value) < 0)) ||
    (max.value !== "" &&
      (!Number.isSafeInteger(Number(max.value)) || Number(max.value) < 0)) ||
    (min.value !== "" &&
      max.value !== "" &&
      Number(min.value) > Number(max.value))
  ) {
    error.value = "Укажите корректный диапазон цен";
    return;
  }
  applied = {
    minPrice: min.value === "" ? undefined : Number(min.value),
    maxPrice: max.value === "" ? undefined : Number(max.value),
    types: [...types.value],
    colors: [...colors.value],
  };
  page.value = 1;
  void load();
}
function reset() {
  min.value = "";
  max.value = "";
  types.value = [...(filters.value?.types ?? [])];
  colors.value = [...(filters.value?.colors ?? [])];
  apply();
}
function sorting(value: string, dir: string) {
  sort.value = value;
  direction.value = dir;
  page.value = 1;
  void load();
}
function go(n: number) {
  page.value = n;
  void load();
  window.scrollTo({ top: 0 });
}
async function loadFilters() {
  filterError.value = "";
  try {
    const options = await api.get<Filters>("/goods/filters");
    filters.value = options;
    types.value = [...options.types];
    colors.value = [...options.colors];
  } catch (e) {
    filterError.value =
      e instanceof Error ? e.message : "Не удалось загрузить фильтры";
  }
}
onMounted(() => {
  void loadFilters();
  void load();
});
</script>
<template>
  <h1>Каталог товаров</h1>
  <div class="catalog-layout">
    <section>
      <div class="sort-bar" aria-label="Сортировка">
        <button
          v-for="s in [
            { label: 'Новые', key: 'newness', dir: 'desc' },
            { label: 'Подороже', key: 'price', dir: 'desc' },
            { label: 'Подешевле', key: 'price', dir: 'asc' },
            { label: 'Популярные', key: 'popularity', dir: 'desc' },
          ]"
          :key="s.label"
          :class="{ active: sort === s.key && direction === s.dir }"
          @click="sorting(s.key, s.dir)"
        >
          {{ s.label }}</button
        ><button
          class="sort-direction"
          aria-label="Изменить направление сортировки"
          @click="sorting(sort, direction === 'asc' ? 'desc' : 'asc')"
        >
          {{ direction === "asc" ? "↑" : "↓" }}
        </button>
      </div>
      <div v-if="error" class="notice" role="alert">
        {{ error }} <button @click="load">Повторить</button>
      </div>
      <p v-if="loading" role="status">Загружаем товары…</p>
      <div v-else-if="!error" class="product-grid">
        <ProductCard
          v-for="product in result.items"
          :key="product.id"
          :product="product"
          purchasable
          @open="selected = $event"
        />
        <p v-if="!result.items.length" class="empty-results">
          Товары по вашему запросу не найдены
        </p>
      </div>
      <nav
        v-if="result.totalPages > 1"
        class="pagination"
        aria-label="Страницы каталога"
      >
        <button
          :disabled="page === 1"
          aria-label="Предыдущая страница"
          @click="go(page - 1)"
        >
          ‹</button
        ><template v-for="n in result.totalPages" :key="n"
          ><span v-if="n === result.totalPages && n > 3">…</span
          ><button
            v-if="n <= 3 || n === result.totalPages"
            :class="{ active: page === n }"
            :aria-current="page === n ? 'page' : undefined"
            @click="go(n)"
          >
            {{ n }}
          </button></template
        ><button
          :disabled="page === result.totalPages"
          aria-label="Следующая страница"
          @click="go(page + 1)"
        >
          ›
        </button>
      </nav>
    </section>
    <aside>
      <div v-if="filterError" class="notice" role="alert">
        {{ filterError }}
        <button type="button" @click="loadFilters">Повторить</button>
      </div>
      <form class="filters" novalidate @submit.prevent="apply">
        <fieldset>
          <legend>Цена, ₽</legend>
          <div class="price-fields">
            <label
              >От<input
                :value="min"
                @input="min = ($event.target as HTMLInputElement).value"
                type="number"
                min="0"
                step="1"
                :placeholder="String(filters?.minPrice ?? 0)" /></label
            ><label
              >До<input
                :value="max"
                @input="max = ($event.target as HTMLInputElement).value"
                type="number"
                min="0"
                step="1"
                :placeholder="String(filters?.maxPrice ?? 0)"
            /></label>
          </div>
          <PriceRange
            v-if="filters"
            v-model:from="min"
            v-model:to="max"
            :minimum="filters.minPrice"
            :maximum="filters.maxPrice"
          />
        </fieldset>
        <fieldset>
          <legend>Тип товара</legend>
          <label v-for="type in filters?.types" :key="type" class="check"
            ><input v-model="types" type="checkbox" :value="type" />{{
              type
            }}</label
          >
        </fieldset>
        <fieldset>
          <legend>Цвет</legend>
          <label v-for="color in filters?.colors" :key="color" class="check"
            ><input v-model="colors" type="checkbox" :value="color" />{{
              color
            }}</label
          >
        </fieldset>
        <div class="filter-actions">
          <button class="button" type="submit">Показать</button
          ><button class="text-button pink" type="button" @click="reset">
            Сбросить
          </button>
        </div>
      </form>
    </aside>
  </div>
  <ProductModal v-if="selected" :product="selected" @close="selected = null" />
</template>
