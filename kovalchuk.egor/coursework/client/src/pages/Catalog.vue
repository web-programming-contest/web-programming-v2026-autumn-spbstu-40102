<script setup lang="ts">
import {computed, reactive, ref} from 'vue';
import {shop} from '../store';
import {selectGoods, paginationNumbers} from '../catalog';
import type {Filters, Sort} from '../catalog';
import ProductCard from '../components/ProductCard.vue';
import Icon from '../components/Icon.vue';
const types = computed(() => [
  ...new Set(shop.goods.map((good) => good.category)),
]);
const colors = computed(() => [
  ...new Set(shop.goods.map((good) => good.color)),
]);
const defaults = (): Filters => ({
  min: '',
  max: '',
  types: [...types.value],
  colors: [...colors.value],
});
const draft = reactive<Filters>(defaults());
const filters = ref<Filters>(defaults());
const sortOptions: Sort[] = [
  {label: 'Новые', field: 'releasedAt', direction: 'desc'},
  {label: 'Популярные', field: 'popularity', direction: 'desc'},
  {label: 'Подешевле', field: 'price', direction: 'asc'},
  {label: 'Подороже', field: 'price', direction: 'desc'},
];
const sort = ref<Sort>({...sortOptions[0]});
const page = ref(1);
const error = ref('');
const selected = computed(() =>
  selectGoods(shop.goods, filters.value, sort.value),
);
const pages = computed(() => Math.ceil(selected.value.length / 9));
const visible = computed(() =>
  selected.value.slice((page.value - 1) * 9, page.value * 9),
);
function apply(): void {
  if (
    (draft.min !== '' &&
      (!Number.isFinite(Number(draft.min)) || Number(draft.min) < 0)) ||
    (draft.max !== '' &&
      (!Number.isFinite(Number(draft.max)) || Number(draft.max) < 0)) ||
    (draft.min !== '' &&
      draft.max !== '' &&
      Number(draft.min) > Number(draft.max))
  ) {
    error.value = 'Укажите корректный диапазон цен: «От» не больше «До».';
    return;
  }
  error.value = '';
  filters.value = {
    ...draft,
    types: [...draft.types],
    colors: [...draft.colors],
  };
  page.value = 1;
}
function reset(): void {
  Object.assign(draft, defaults());
  filters.value = defaults();
  error.value = '';
  page.value = 1;
}
function setSort(option: Sort): void {
  sort.value = {...option};
  page.value = 1;
}
</script>
<template>
  <main class="container catalog-page">
    <h1>Каталог товаров</h1>
    <div class="catalog-layout">
      <section aria-label="Товары">
        <div class="sorting" aria-label="Сортировка">
          <button
            v-for="option in sortOptions"
            :key="option.label"
            type="button"
            class="sort-link"
            :class="{
              'sort-active':
                sort.field === option.field &&
                sort.direction === option.direction,
            }"
            :aria-pressed="
              sort.field === option.field && sort.direction === option.direction
            "
            @click="setSort(option)"
          >
            {{ option.label }}</button
          ><label class="sort-direction"
            >Порядок<select
              v-model="sort.direction"
              aria-label="Направление сортировки"
              @change="page = 1"
            >
              <option value="asc">По возрастанию</option>
              <option value="desc">По убыванию</option>
            </select></label
          >
        </div>
        <div v-if="visible.length" class="product-grid">
          <ProductCard v-for="good in visible" :key="good.id" :good="good" />
        </div>
        <p v-else class="no-results" role="status">
          Товары по вашему запросу не найдены.
        </p>
        <nav v-if="pages > 1" class="pagination" aria-label="Страницы каталога">
          <button
            type="button"
            class="page-button page-previous"
            aria-label="Предыдущая страница"
            :disabled="page === 1"
            @click="page--"
          >
            <Icon name="arrow" /></button
          ><template
            v-for="(number, index) in paginationNumbers(pages, page)"
            :key="`${number}-${index}`"
            ><span v-if="number === 'ellipsis'">…</span
            ><button
              v-else
              type="button"
              class="page-button"
              :class="{'page-active': page === number}"
              :aria-current="page === number ? 'page' : undefined"
              @click="page = number"
            >
              {{ number }}
            </button></template
          ><button
            type="button"
            class="page-button"
            aria-label="Следующая страница"
            :disabled="page === pages"
            @click="page++"
          >
            <Icon name="arrow" />
          </button>
        </nav>
      </section>
      <aside class="filters">
        <form novalidate aria-label="Фильтры каталога" @submit.prevent="apply">
          <fieldset>
            <legend>Цена, ₽</legend>
            <div class="price-fields">
              <label
                >От<input
                  v-model="draft.min"
                  type="number"
                  min="0"
                  name="min"
                  placeholder="0"
                  :aria-invalid="Boolean(error)" /></label
              ><label
                >До<input
                  v-model="draft.max"
                  type="number"
                  min="0"
                  name="max"
                  placeholder="102099"
                  :aria-invalid="Boolean(error)"
              /></label>
            </div>
            <p v-if="error" class="field-error" role="alert">{{ error }}</p>
          </fieldset>
          <fieldset>
            <legend>Тип товара</legend>
            <label v-for="type in types" :key="type" class="check-label"
              ><input v-model="draft.types" type="checkbox" :value="type" />{{
                type
              }}</label
            >
          </fieldset>
          <fieldset>
            <legend>Цвет</legend>
            <label v-for="color in colors" :key="color" class="check-label"
              ><input v-model="draft.colors" type="checkbox" :value="color" />{{
                color
              }}</label
            >
          </fieldset>
          <div class="filter-buttons">
            <button type="submit" class="button">Показать</button
            ><button type="button" class="text-button" @click="reset">
              Сбросить
            </button>
          </div>
        </form>
      </aside>
    </div>
  </main>
</template>
