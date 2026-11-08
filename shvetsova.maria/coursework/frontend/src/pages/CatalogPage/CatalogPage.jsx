import {useEffect, useState} from 'react';
import {api} from '@/api/client';
import {ProductCard} from '@/components/ProductCard/ProductCard';
import {Sorting} from './Sorting/Sorting';
import {Pagination} from './Pagination/Pagination';
import styles from './CatalogPage.module.scss';
import {Filters} from './Filters/Filters';
import {CartControl} from '@/components/CartControl/CartControl';
import {ProductModal} from './ProductModal/ProductModal';

const INITIAL_FILTERS = {type: [], color: [], price_min: '', price_max: ''};

export function CatalogPage() {
  const [sort, setSort] = useState('new');
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [page, setPage] = useState(1);
  const [data, setData] = useState({items: [], total: 0, page: 1, pages: 1});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    let ignore = false;
    setIsLoading(true);

    api
      .getGoods({sort, page, ...filters})
      .then((result) => {
        if (ignore) {
          return;
        }
        setData(result);
        setError('');
      })
      .catch(() => {
        if (!ignore) {
          setError(
            'Не удалось загрузить товары. Попробуйте обновить страницу.',
          );
        }
      })
      .finally(() => {
        if (!ignore) {
          setIsLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [sort, filters, page]);

  const handleSortChange = (value) => {
    setSort(value);
    setPage(1);
  };

  const handleFiltersApply = (nextFilters) => {
    setFilters(nextFilters);
    setPage(1);
  };

  const handleFiltersReset = () => {
    setFilters(INITIAL_FILTERS);
    setPage(1);
  };

  const handlePageChange = (nextPage) => {
    setPage(nextPage);
    window.scrollTo({top: 0, behavior: 'smooth'});
  };

  return (
    <div className={`wrapper ${styles.page}`}>
      <h1 className={styles.title}>Каталог товаров</h1>

      <Sorting value={sort} onChange={handleSortChange} />

      <div className={styles.layout}>
        <div className={styles.main}>
          {error && <p className={styles.message}>{error}</p>}

          {!error && !isLoading && data.items.length === 0 && (
            <p className={styles.message}>
              По выбранным фильтрам ничего не найдено
            </p>
          )}

          <ul className={styles.grid}>
            {data.items.map((product) => (
              <li key={product.id} className={styles.card}>
                <ProductCard
                  product={product}
                  onClick={() => setSelectedProduct(product)}
                >
                  <CartControl product={product} />
                </ProductCard>
              </li>
            ))}
          </ul>

          {data.pages > 1 && (
            <Pagination
              currentPage={page}
              totalPages={data.pages}
              onChange={handlePageChange}
            />
          )}
        </div>

        <aside className={styles.filters}>
          <Filters onApply={handleFiltersApply} onReset={handleFiltersReset} />
        </aside>
      </div>

      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  );
}
