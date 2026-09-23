import { Link } from 'react-router-dom';
import {
  MessageCircle,
  ShoppingBag,
} from 'lucide-react';

import { useCart } from '../context/CartContext';
import { productWhatsApp } from '../utils/whatsapp';

export default function ProductCard({ product }) {
  const { add } = useCart();

  const stock = Number(product.stock ?? 0);
  const normalPrice = Number(product.price || 0);
  const salePrice = Number(product.salePrice || 0);

  const outOfStock = stock <= 0;

  const onSale =
    salePrice > 0 &&
    salePrice < normalPrice;

  const actualPrice = onSale
    ? salePrice
    : normalPrice;

  const cartProduct = {
    ...product,
    price: actualPrice,
    originalPrice: normalPrice,
  };

  return (
    <article className="product-card">
      <Link to={`/product/${product.id}`}>
        <div className="product-image-wrapper">
          <img
            src={
              product.images?.[0] ||
              'https://placehold.co/600x500?text=Honey+%26+Home'
            }
            alt={product.name}
          />

          {onSale && (
            <span className="sale-badge">
              SALE
            </span>
          )}

          {outOfStock && (
            <span className="stock-badge out">
              Out of stock
            </span>
          )}
        </div>
      </Link>

      <div className="card-body">
        <small>
          {product.category || 'Home'}
        </small>

        <Link to={`/product/${product.id}`}>
          <h3>{product.name}</h3>
        </Link>

        {onSale ? (
          <div className="sale-price">
            <strong>
              R{salePrice.toFixed(2)}
            </strong>

            <span>
              R{normalPrice.toFixed(2)}
            </span>
          </div>
        ) : (
          <strong>
            R{normalPrice.toFixed(2)}
          </strong>
        )}

        <p
          className={
            outOfStock
              ? 'stock-status out'
              : 'stock-status'
          }
        >
          {outOfStock
            ? 'Out of stock'
            : `${stock} in stock`}
        </p>

        <div className="actions">
          <button
            onClick={() => add(cartProduct)}
            disabled={outOfStock}
            className={
              outOfStock
                ? 'disabled-button'
                : ''
            }
          >
            <ShoppingBag size={17} />

            {outOfStock
              ? 'Out of stock'
              : 'Add'}
          </button>

          <a
            className="outline"
            href={productWhatsApp({
              ...product,
              price: actualPrice,
            })}
            target="_blank"
            rel="noreferrer"
          >
            <MessageCircle size={17} />
            Enquire
          </a>
        </div>
      </div>
    </article>
  );
}