<script setup lang="ts">
import {RouterLink} from 'vue-router';
import Icon from './Icon.vue';
</script>
<template>
  <footer class="site-footer">
    <div class="container footer-content">
      <div>
        <RouterLink to="/" class="footer-brand">Gadget Hub</RouterLink>
        <p>Магазин надежных гаджетов</p>
        <small>© 2024 ООО «Гаджет Хаб». Все права защищены</small>
      </div>
      <a href="tel:88006783424" class="footer-phone"
        ><Icon name="phone" />8 (800) 678-34-24</a
      >
      <div class="social-links">
        <a
          href="https://vk.com/"
          target="_blank"
          rel="noreferrer"
          aria-label="ВКонтакте"
          ><img src="/assets/social/vk.png" alt="" width="30" height="30" /></a
        ><a
          href="https://t.me/"
          target="_blank"
          rel="noreferrer"
          aria-label="Telegram"
          ><img
            src="/assets/social/telegram.png"
            alt=""
            width="30"
            height="30" /></a
        ><a
          href="https://wa.me/78006783424"
          target="_blank"
          rel="noreferrer"
          aria-label="WhatsApp"
          ><img src="/assets/social/whatsapp.png" alt="" width="30" height="30"
        /></a>
      </div>
    </div>
  </footer>
</template>
