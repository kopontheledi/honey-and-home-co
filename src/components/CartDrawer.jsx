import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function CartDrawer() {
  const { items, subtotal } = useCart();

  return (
    <aside className="cart-summary">
      <h3>Your basket</h3>

      <p>{items.length} item(s)</p>

      <strong>R{subtotal.toFixed(2)}</strong>

      <Link className="button" to="/cart">
        View cart
      </Link>
    </aside>
  );
}