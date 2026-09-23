import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import {
  MessageCircle,
  ShoppingBag,
} from 'lucide-react';

import { db } from '../lib/firebase';
import ProductGallery from '../components/ProductGallery';
import { useCart } from '../context/CartContext';
import { productWhatsApp } from '../utils/whatsapp';

export default function ProductDetails() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const { add } = useCart();

  useEffect(() => {
    async function loadProduct() {
      try {
        const snapshot = await getDoc(
          doc(db, 'products', id)
        );

        if (snapshot.exists()) {
          setProduct({
            id: snapshot.id,
            ...snapshot.data(),
          });
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [id]);

  if (loading) {
    return (
      <section className="section">
        Loading...
      </section>
    );
  }

  if (!product) {
    return (
      <section className="section">
        Product not found.
      </section>
    );
  }

  const stock = Number(product.stock ?? 0);

  const normalPrice = Number(
    product.price || 0
  );

  const salePrice = Number(
    product.salePrice || 0
  );

  const onSale =
    salePrice > 0 &&
    salePrice < normalPrice;

  const actualPrice = onSale
    ? salePrice
    : normalPrice;

  const outOfStock = stock <= 0;

  const cartProduct = {
    ...product,
    price: actualPrice,
    originalPrice: normalPrice,
  };

  return (
    <section className="product-page">
      <ProductGallery
        images={product.images}
        name={product.name}
      />

      <div className="product-info">
        <p className="eyebrow">
          {product.category ||
            'HONEY & HOME'}
        </p>

        <h1>{product.name}</h1>

        {onSale ? (
          <div className="product-sale-price">
            <span className="sale-label">
              SALE
            </span>

            <div>
              <strong>
                R{salePrice.toFixed(2)}
              </strong>

              <span>
                R{normalPrice.toFixed(2)}
              </span>
            </div>
          </div>
        ) : (
          <div className="price">
            R{normalPrice.toFixed(2)}
          </div>
        )}

        <p
          className={
            outOfStock
              ? 'stock-status product-stock out'
              : 'stock-status product-stock'
          }
        >
          {outOfStock
            ? 'Out of stock'
            : `${stock} in stock`}
        </p>

        <p>
          {product.description ||
            'A lovely addition to your home.'}
        </p>

        <button
          className={`button ${outOfStock
            ? 'disabled-button'
            : ''
            }`}
          onClick={() => add(cartProduct)}
          disabled={outOfStock}
        >
          <ShoppingBag size={18} />

          {outOfStock
            ? 'Out of stock'
            : 'Add to cart'}
        </button>

        <a
          className="button secondary"
          href={productWhatsApp(product)}
          target="_blank"
          rel="noreferrer"
        >
          <MessageCircle size={18} />
          Enquire on WhatsApp
        </a>
      </div>
    </section>
  );
}