<script setup lang="ts">
import {computed} from 'vue';
import {RouterLink} from 'vue-router';
import {shop} from '../store';
import Carousel from '../components/Carousel.vue';
import Icon from '../components/Icon.vue';
const priority = (ids: number[], id: number): number =>
  ids.includes(id) ? ids.indexOf(id) : 99;
const hits = computed(() =>
  shop.goods
    .filter((good) => good.isHit)
    .sort(
      (a, b) =>
        priority([107, 106, 105], a.id) - priority([107, 106, 105], b.id),
    ),
);
const fresh = computed(() =>
  shop.goods
    .filter((good) => good.isNew)
    .sort(
      (a, b) =>
        priority([101, 102, 103], a.id) - priority([101, 102, 103], b.id),
    ),
);
</script>
<template>
  <main class="container home-page">
    <h1 class="visually-hidden">Gadget Hub — магазин надежных гаджетов</h1>
    <RouterLink to="/catalog" class="hero-link"
      ><img
        class="hero-image"
        src="/assets/hero.png"
        width="1240"
        height="560"
        alt="Super Sale: умный робот-друг Red solution Reddy Air за 27 990 рублей, скидка 10%" /></RouterLink
    ><Carousel
      title="Хиты продаж"
      description="Тысячи покупателей уже одобрили эти товары. Самые популярные, проверенные и надежные гаджеты!"
      :goods="hits"
    /><Carousel
      title="Новинки"
      description="Их только произвели — они уже у нас! Все самое новое и свежее на рынке электроники"
      :goods="fresh"
      fresh
    />
    <section class="advantages">
      <h2>Преимущества</h2>
      <div class="advantages-grid">
        <div>
          <Icon name="rocket" />
          <h3>Утром заказали,<br />вечером получили</h3>
        </div>
        <div>
          <Icon name="return" />
          <h3>С товаром что-то не так?<br />Вернем деньги</h3>
        </div>
        <div>
          <Icon name="shield" />
          <h3>Только оригинальные<br />товары</h3>
        </div>
      </div>
    </section>
    <section class="contacts">
      <h2>Работаем 24/7</h2>
      <div class="contacts-grid">
        <a href="tel:88006783424"><Icon name="phone" />8 (800) 678-34-24</a
        ><a href="mailto:gadget@hub.ru"><Icon name="mail" />gadget@hub.ru</a>
        <p>
          <Icon name="pin" /><span
            >Санкт-Петербург, ул.<br />Барочная, д. 7, корпус 2</span
          >
        </p>
      </div>
    </section>
  </main>
</template>
