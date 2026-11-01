<script setup lang="ts">
import { onMounted, ref } from "vue";
import { api } from "../api/client";
import type { Product } from "../api/models";
import ProductCard from "../components/ProductCard.vue";
import ProductModal from "../components/ProductModal.vue";
import flameIcon from "../assets/design/flame.png";
import sparklesIcon from "../assets/design/sparkles.png";
const showcase = ref<{ newItems: Product[]; hitItems: Product[] }>({
  newItems: [],
  hitItems: [],
});
const error = ref(""),
  loading = ref(true),
  selected = ref<Product | null>(null);
const positions = ref({ newItems: 0, hitItems: 0 });
const sections = [
  {
    key: "hitItems" as const,
    title: "Хиты продаж",
    description:
      "Тысячи покупателей уже одобрили эти товары. Самые популярные, проверенные и надежные гаджеты!",
    icon: flameIcon,
  },
  {
    key: "newItems" as const,
    title: "Новинки",
    description:
      "Их только произвели — они уже у нас! Все самое новое и свежее на рынке электроники",
    icon: sparklesIcon,
  },
];
function visible(key: "newItems" | "hitItems") {
  const a = showcase.value[key];
  return Array.from(
    { length: Math.min(3, a.length) },
    (_, i) => a[(positions.value[key] + i) % a.length]!,
  );
}
function move(key: "newItems" | "hitItems", delta: number) {
  const n = showcase.value[key].length;
  if (n) positions.value[key] = (positions.value[key] + delta + n) % n;
}
async function load() {
  loading.value = true;
  error.value = "";
  try {
    showcase.value = await api.get("/showcase");
  } catch (e) {
    error.value =
      e instanceof Error ? e.message : "Не удалось загрузить товары";
  } finally {
    loading.value = false;
  }
}
onMounted(load);
</script>
<template>
  <section class="home">
    <RouterLink to="/catalog" class="hero"
      ><img
        src="../assets/design/banner.png"
        alt="Суперраспродажа гаджетов. Перейти в каталог"
    /></RouterLink>
    <p v-if="loading" role="status">Загружаем товары…</p>
    <div v-if="error" class="notice" role="alert">
      {{ error }} <button @click="load">Повторить</button>
    </div>
    <section v-for="section in sections" :key="section.key" class="showcase">
      <div class="showcase-heading">
        <img
          class="section-symbol"
          :class="section.key"
          :src="section.icon"
          alt=""
        />
        <h2>{{ section.title }}</h2>
        <p>{{ section.description }}</p>
      </div>
      <div class="carousel">
        <button
          class="carousel-arrow prev"
          :aria-label="section.title + ': предыдущие товары'"
          :disabled="!showcase[section.key].length"
          @click="move(section.key, -1)"
        >
          ‹
        </button>
        <div class="carousel-products">
          <ProductCard
            v-for="product in visible(section.key)"
            :key="product.id"
            :product="product"
            @open="selected = $event"
          />
        </div>
        <button
          class="carousel-arrow next"
          :aria-label="section.title + ': следующие товары'"
          :disabled="!showcase[section.key].length"
          @click="move(section.key, 1)"
        >
          ›
        </button>
        <p v-if="!loading && !error && !showcase[section.key].length">
          Товары скоро появятся
        </p>
      </div>
    </section>
    <section class="advantages">
      <h2>Преимущества</h2>
      <div class="advantage-grid">
        <article>
          <img src="../assets/design/delivery.png" alt="" />
          <h3>Утром заказали,<br />вечером получили</h3>
        </article>
        <article>
          <img src="../assets/design/refund.png" alt="" />
          <h3>С товаром что-то не так?<br />Вернем деньги</h3>
        </article>
        <article>
          <img src="../assets/design/certificate.png" alt="" />
          <h3>Только оригинальные<br />товары</h3>
        </article>
      </div>
    </section>
    <section class="contacts">
      <h2>Работаем 24/7</h2>
      <div>
        <a href="tel:88006783424"
          ><img src="../assets/design/phone.png" alt="" />8 (800) 678-34-24</a
        ><a href="mailto:gadget@hub.ru"
          ><img src="../assets/design/email.png" alt="" />gadget@hub.ru</a
        >
        <p>
          <img src="../assets/design/location.png" alt="" />Санкт-Петербург, ул.
          Барочная, д.7, корпус 2
        </p>
      </div>
    </section>
  </section>
  <ProductModal v-if="selected" :product="selected" @close="selected = null" />
</template>
