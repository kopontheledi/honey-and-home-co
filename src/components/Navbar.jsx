import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { items } = useCart();

  const count = items.reduce(
    (total, item) => total + item.qty,
    0
  );

  return (
    <header className="nav">
      <Link className="brand" to="/">
        Honey <span>&</span> Home Co
      </Link>

      <nav>
        <Link to="/">Home</Link>

        <Link to="/shop">Shop</Link>

        <Link to="/cart" className="cart-link">
          <ShoppingBag size={19} />
          Cart

          {count > 0 && <b>{count}</b>}
        </Link>
      </nav>
    </header>
  );
}