import { Link } from 'react-router-dom';
import { MessageCircle, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { productWhatsApp } from '../utils/whatsapp';

export default function ProductCard({ product }) {
  const { add } = useCart();

  return (
    <article className="product-card">
      <Link to={`/product/${product.id}`}>
        <img
          src={
            product.images?.[0] ||
            'https://placehold.co/600x500?text=Honey+%26+Home'
          }
          alt={product.name}
        />
      </Link>

      <div className="card-body">
        <small>{product.category || 'Home'}</small>

        <Link to={`/product/${product.id}`}>
          <h3>{product.name}</h3>
        </Link>

        <strong>R{Number(product.price).toFixed(2)}</strong>

        <div className="actions">
          <button onClick={() => add(product)}>
            <ShoppingBag size={17} />
            Add
          </button>

          <a
            className="outline"
            href={productWhatsApp(product)}
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