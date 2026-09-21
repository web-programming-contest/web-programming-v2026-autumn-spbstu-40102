<script setup>
import {ref} from 'vue';

import PriceRange from '../components/PriceRange.vue';
import ProductCard from '../components/ProductCard.vue';
import ProductModal from '../components/ProductModal.vue';
import {useCatalog} from '../composables/useCatalog.js';

const selectedProduct = ref(null);

const {
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
} = useCatalog();
</script>

<template>
  <section class="catalog-page site-container">
    <div class="section-heading">
      <h1>Каталог товаров</h1>
      <div class="sort-tabs" aria-label="Сортировка товаров">
        <button
          v-for="option in [
            ['new', 'Новые'],
            ['popular', 'Популярные'],
            ['price-asc', 'Подешевле'],
            ['price-desc', 'Подороже'],
          ]"
          :key="option[0]"
          class="sort-tabs__button"
          :class="{'is-active': sortMode === option[0]}"
          type="button"
          @click="
            sortMode = option[0];
            page = 1;
          "
        >
          {{ option[1] }}
        </button>
      </div>
    </div>

    <p v-if="loading" class="status-message">Загрузка каталога…</p>
    <p v-else-if="error" class="status-message status-message--error">
      {{ error }}
    </p>

    <div v-else class="catalog-layout">
      <div class="catalog-results">
        <div v-if="visibleProducts.length" class="product-grid">
          <ProductCard
            v-for="product in visibleProducts"
            :key="product.id"
            :product="product"
            @open="selectedProduct = $event"
          />
        </div>
        <p v-else class="empty-results">Товары по вашему запросу не найдены.</p>

        <nav v-if="pageCount > 1" class="pagination" aria-label="Пагинация">
          <button
            v-for="button in pageButtons"
            :key="button"
            class="pagination__button"
            :class="{'is-active': button === page}"
            :aria-current="button === page ? 'page' : undefined"
            type="button"
            @click="selectPage(button)"
          >
            {{ button }}
          </button>
          <button
            class="pagination__button"
            type="button"
            :disabled="page === pageCount"
            aria-label="Следующая страница"
            @click="page += 1"
          >
            ›
          </button>
        </nav>
      </div>

      <aside class="filter-panel">
        <h2>Цена, ₽</h2>
        <PriceRange
          :min="priceBounds.min"
          :max="priceBounds.max"
          :model-min="draft.min"
          :model-max="draft.max"
          @update:model-min="draft.min = $event"
          @update:model-max="draft.max = $event"
        />

        <fieldset>
          <legend>Тип товара</legend>
          <label
            v-for="category in categories"
            :key="category"
            class="check-field"
            ><input
              v-model="draft.categories"
              type="checkbox"
              :value="category"
            />
            {{ category }}</label
          >
        </fieldset>

        <fieldset>
          <legend>Цвет</legend>
          <label v-for="color in colors" :key="color" class="check-field"
            ><input v-model="draft.colors" type="checkbox" :value="color" />
            {{ color }}</label
          >
        </fieldset>

        <div class="filter-panel__actions">
          <button
            class="button button--blue"
            type="button"
            @click="applyFilters"
          >
            Показать
          </button>
          <button
            class="button button--link"
            type="button"
            @click="resetFilters"
          >
            Сбросить
          </button>
        </div>
      </aside>
    </div>

    <ProductModal
      :open="Boolean(selectedProduct)"
      :product="selectedProduct"
      @update:open="selectedProduct = null"
    />
  </section>
</template>
