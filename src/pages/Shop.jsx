import { useEffect, useMemo, useState } from 'react';
import {
  collection,
  getDocs,
  orderBy,
  query,
} from 'firebase/firestore';
import {
  Search,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import {
  useSearchParams,
} from 'react-router-dom';

import { db } from '../lib/firebase';
import ProductCard from '../components/ProductCard';

const categories = [
  'All',
  'Bowls',
  'Cups',
  'Standing Mirrors',
  'Noodle Boxes',
  'Plates',
  'Pots',
  'Glasses',
  'Other',
];

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchParams, setSearchParams] =
    useSearchParams();

  const categoryFromUrl =
    searchParams.get('category') || 'All';

  const [category, setCategory] = useState(
    categories.includes(categoryFromUrl)
      ? categoryFromUrl
      : 'All'
  );

  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('newest');

  useEffect(() => {
    async function loadProducts() {
      try {
        const snapshot = await getDocs(
          query(
            collection(db, 'products'),
            orderBy('createdAt', 'desc')
          )
        );

        const productList =
          snapshot.docs.map((document) => ({
            id: document.id,
            ...document.data(),
          }));

        setProducts(productList);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  /*
   * Keep the category in sync if someone
   * enters through a Home category link.
   */
  useEffect(() => {
    const urlCategory =
      searchParams.get('category') || 'All';

    if (categories.includes(urlCategory)) {
      setCategory(urlCategory);
    } else {
      setCategory('All');
    }
  }, [searchParams]);

  function changeCategory(newCategory) {
    setCategory(newCategory);

    if (newCategory === 'All') {
      setSearchParams({});
    } else {
      setSearchParams({
        category: newCategory,
      });
    }
  }

  function clearFilters() {
    setSearch('');
    setSort('newest');
    setCategory('All');
    setSearchParams({});
  }

  const filteredProducts = useMemo(() => {
    let result = [...products];

    /*
     * CATEGORY
     */
    if (category !== 'All') {
      result = result.filter(
        (product) =>
          product.category === category
      );
    }

    /*
     * SEARCH
     */
    const searchText =
      search.trim().toLowerCase();

    if (searchText) {
      result = result.filter((product) => {
        const name =
          product.name?.toLowerCase() || '';

        const description =
          product.description?.toLowerCase() ||
          '';

        const productCategory =
          product.category?.toLowerCase() ||
          '';

        return (
          name.includes(searchText) ||
          description.includes(searchText) ||
          productCategory.includes(searchText)
        );
      });
    }

    /*
     * SORTING
     */
    if (sort === 'price-low') {
      result.sort(
        (a, b) =>
          Number(a.price) - Number(b.price)
      );
    }

    if (sort === 'price-high') {
      result.sort(
        (a, b) =>
          Number(b.price) - Number(a.price)
      );
    }

    if (sort === 'name') {
      result.sort((a, b) =>
        (a.name || '').localeCompare(
          b.name || ''
        )
      );
    }

    /*
     * Products are already loaded newest
     * first from Firestore, so no additional
     * sorting is needed for "newest".
     */

    return result;
  }, [
    products,
    category,
    search,
    sort,
  ]);

  const filtersActive =
    category !== 'All' ||
    search.trim() !== '' ||
    sort !== 'newest';

  return (
    <section className="section shop-page">
      {/* SHOP HEADING */}

      <div className="shop-heading">
        <p className="eyebrow">
          SHOP HONEY & HOME
        </p>

        <h1>Our collection</h1>

        <p>
          Beautiful, useful pieces for your
          home.
        </p>
      </div>

      {/* SEARCH */}

      <div className="shop-search">
        <Search size={19} />

        <input
          type="search"
          placeholder="Search our collection..."
          value={search}
          onChange={(event) =>
            setSearch(event.target.value)
          }
        />

        {search && (
          <button
            type="button"
            onClick={() => setSearch('')}
            aria-label="Clear search"
          >
            <X size={17} />
          </button>
        )}
      </div>

      {/* CATEGORY FILTERS */}

      <div className="shop-categories">
        {categories.map(
          (categoryName) => (
            <button
              type="button"
              key={categoryName}
              className={
                category === categoryName
                  ? 'active'
                  : ''
              }
              onClick={() =>
                changeCategory(categoryName)
              }
            >
              {categoryName}
            </button>
          )
        )}
      </div>

      {/* SORT / RESULTS */}

      <div className="shop-toolbar">
        <p>
          <strong>
            {filteredProducts.length}
          </strong>{' '}
          {filteredProducts.length === 1
            ? 'product'
            : 'products'}
        </p>

        <div className="shop-sort">
          <SlidersHorizontal size={17} />

          <label htmlFor="product-sort">
            Sort:
          </label>

          <select
            id="product-sort"
            value={sort}
            onChange={(event) =>
              setSort(event.target.value)
            }
          >
            <option value="newest">
              Newest
            </option>

            <option value="price-low">
              Price: Low to high
            </option>

            <option value="price-high">
              Price: High to low
            </option>

            <option value="name">
              Name: A–Z
            </option>
          </select>
        </div>
      </div>

      {/* PRODUCTS */}

      {loading ? (
        <div className="shop-loading">
          <p>Loading products...</p>
        </div>
      ) : filteredProducts.length ? (
        <div className="products">
          {filteredProducts.map(
            (product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            )
          )}
        </div>
      ) : products.length ? (
        <div className="empty shop-empty">
          <h3>No products found</h3>

          <p>
            We couldn't find anything matching
            your filters.
          </p>

          {filtersActive && (
            <button
              type="button"
              className="button"
              onClick={clearFilters}
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <div className="empty">
          <h3>No products yet</h3>

          <p>
            Products will appear here once
            they're added.
          </p>
        </div>
      )}
    </section>
  );
}