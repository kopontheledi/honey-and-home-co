import { Link } from 'react-router-dom';
import { Trash2 } from 'lucide-react';

import { useCart } from '../context/CartContext';
import { cartWhatsApp } from '../utils/whatsapp';

export default function Cart() {
  const {
    items,
    remove,
    setQty,
    subtotal,
  } = useCart();

  if (!items.length) {
    return (
      <section className="section empty">
        <h1>Your cart is empty</h1>

        <Link
          className="button"
          to="/shop"
        >
          Start shopping
        </Link>
      </section>
    );
  }

  return (
    <section className="section">
      <h1>Your cart</h1>

      <div className="cart-layout">
        <div>
          {items.map((item) => (
            <div
              className="cart-item"
              key={item.id}
            >
              <img
                src={
                  item.images?.[0] ||
                  'https://placehold.co/120'
                }
                alt={item.name}
              />

              <div>
                <h3>{item.name}</h3>

                <p>
                  R{Number(item.price).toFixed(2)}
                </p>

                <input
                  type="number"
                  min="1"
                  value={item.qty}
                  onChange={(event) =>
                    setQty(
                      item.id,
                      Number(event.target.value)
                    )
                  }
                />
              </div>

              <button
                className="icon-button"
                onClick={() =>
                  remove(item.id)
                }
                aria-label={`Remove ${item.name}`}
              >
                <Trash2 />
              </button>
            </div>
          ))}
        </div>

        <aside className="checkout-box">
          <h3>Order summary</h3>

          <div>
            <span>Subtotal</span>

            <strong>
              R{subtotal.toFixed(2)}
            </strong>
          </div>

          <p>
            Website checkout delivery:{' '}
            <strong>R150</strong>
          </p>

          <Link
            className="button"
            to="/checkout"
          >
            Checkout
          </Link>

          <a
            className="button secondary"
            href={cartWhatsApp(items)}
            target="_blank"
            rel="noreferrer"
          >
            Order via WhatsApp
          </a>
        </aside>
      </div>
    </section>
  );
}