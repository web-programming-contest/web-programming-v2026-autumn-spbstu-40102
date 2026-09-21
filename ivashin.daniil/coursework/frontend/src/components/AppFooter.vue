<template>
  <footer class="site-footer">
    <div class="site-container site-footer__inner">
      <div>
        <RouterLink class="site-footer__brand" to="/">Gadget Hub</RouterLink>
        <p class="site-footer__caption">Магазин надёжных гаджетов</p>
        <p class="site-footer__copyright">
          © 2024 ООО «Гаджет Хаб». Все права защищены
        </p>
      </div>

      <a class="site-footer__phone" href="tel:88006783424">
        <img src="/assets/images/icons/mobile.svg" alt="" />
        <span>8 (800) 678-34-24</span>
      </a>

      <div class="social-links" aria-label="Социальные сети">
        <a
          href="https://vk.com/"
          target="_blank"
          rel="noreferrer"
          aria-label="VK"
          ><img src="/assets/images/social icons/vk.png" alt=""
        /></a>
        <a
          href="https://t.me/"
          target="_blank"
          rel="noreferrer"
          aria-label="Telegram"
          ><img src="/assets/images/social icons/telegram.png" alt=""
        /></a>
        <a
          href="https://www.whatsapp.com/"
          target="_blank"
          rel="noreferrer"
          aria-label="WhatsApp"
          ><img src="/assets/images/social icons/whatsapp.png" alt=""
        /></a>
      </div>
    </div>
  </footer>
</template>
