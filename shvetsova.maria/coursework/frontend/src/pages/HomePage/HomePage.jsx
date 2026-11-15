import {Advantages} from '../../components/Advantages/Advantages';
import {Contacts} from '../../components/Contacts/Contacts';
import {ProductCarousel} from './ProductCarousel/ProductCarousel';
import heroImage from '@/assets/images/banner.webp';
import fireIcon from '@/assets/icons/fire.svg';
import sparklesIcon from '@/assets/icons/sparkles.svg';
import styles from './HomePage.module.scss';
import {useEffect, useState} from 'react';
import {api} from '@/api/client';

export function HomePage() {
  const [newGoods, setNewGoods] = useState([]);
  const [popularGoods, setPopularGoods] = useState([]);

  useEffect(() => {
    let ignore = false;

    Promise.all([
      api.getGoods({sort: 'new', limit: 8}),
      api.getGoods({sort: 'popular', limit: 8}),
    ])
      .then(([newPage, popularPage]) => {
        if (ignore) {
          return;
        }
        setNewGoods(newPage.items);
        setPopularGoods(popularPage.items);
      })
      .catch(() => {});

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <div className={`wrapper ${styles.page}`}>
      <section className={styles.hero}>
        <img
          className={styles.heroImage}
          src={heroImage}
          alt="Super Sale: умный робот-друг Red solution Reddy Air со скидкой 10% за 27990 ₽"
        />
      </section>

      <ProductCarousel
        icon={sparklesIcon}
        title="Новинки"
        description="Их только привезли - они уже у нас! Все самое новое и свежее на рынке электроники"
        products={newGoods}
      />

      <ProductCarousel
        icon={fireIcon}
        title="Хиты продаж"
        description="Самые популярные товары, которые чаще всего выбирают наши покупатели"
        products={popularGoods}
      />

      <Advantages />

      <Contacts />
    </div>
  );
}
