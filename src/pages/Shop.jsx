import { useEffect, useState } from 'react';
import {
  collection,
  getDocs,
  query,
  orderBy,
} from 'firebase/firestore';

import { db } from '../lib/firebase';
import ProductCard from '../components/ProductCard';

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      try {
        const snapshot = await getDocs(
          query(
            collection(db, 'products'),
            orderBy('createdAt', 'desc')
          )
        );

        const productList = snapshot.docs.map(
          (document) => ({
            id: document.id,
            ...document.data(),
          })
        );

        setProducts(productList);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  return (
    <section className="section">
      <p className="eyebrow">
        SHOP HONEY & HOME
      </p>

      <h1>Our collection</h1>

      <p>
        Beautiful, useful pieces for your home.
      </p>

      {loading ? (
        <p>Loading products...</p>
      ) : products.length ? (
        <div className="products">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}
        </div>
      ) : (
        <div className="empty">
          <h3>No products yet</h3>

          <p>
            Add your first item from the admin page.
          </p>
        </div>
      )}
    </section>
  );
}