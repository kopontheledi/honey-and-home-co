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
    getDoc(doc(db, 'products', id))
      .then((snapshot) => {
        if (snapshot.exists()) {
          setProduct({
            id: snapshot.id,
            ...snapshot.data(),
          });
        }
      })
      .finally(() => {
        setLoading(false);
      });
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

  return (
    <section className="product-page">
      <ProductGallery
        images={product.images}
        name={product.name}
      />

      <div className="product-info">
        <p className="eyebrow">
          {product.category || 'HONEY & HOME'}
        </p>

        <h1>{product.name}</h1>

        <div className="price">
          R{Number(product.price).toFixed(2)}
        </div>

        <p>
          {product.description ||
            'A lovely addition to your home.'}
        </p>

        <button
          className="button"
          onClick={() => add(product)}
        >
          <ShoppingBag size={18} />
          Add to cart
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