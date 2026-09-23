import { useState } from 'react';
import {
  collection,
  doc,
  getDoc,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { Link } from 'react-router-dom';

import { db } from '../lib/firebase';
import { useCart } from '../context/CartContext';

export default function Checkout() {
  const {
    items,
    subtotal,
    clear,
  } = useCart();

  const [form, setForm] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
  });

  const [status, setStatus] = useState('');
  const [busy, setBusy] = useState(false);
  const [success, setSuccess] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');

  const delivery = 150;
  const displayedTotal = subtotal + delivery;

  async function submit(event) {
    event.preventDefault();

    if (!items.length || busy) {
      return;
    }

    setBusy(true);
    setStatus('');

    try {
      /*
       * Get the latest product information
       * directly from Firestore.
       */
      const checkedProducts = [];

      for (const item of items) {
        const productRef = doc(
          db,
          'products',
          item.id
        );

        const productSnapshot =
          await getDoc(productRef);

        if (!productSnapshot.exists()) {
          throw new Error(
            `${item.name} is no longer available. Please remove it from your cart.`
          );
        }

        const product = {
          id: productSnapshot.id,
          ...productSnapshot.data(),
        };

        const currentStock = Number(
          product.stock ?? 0
        );

        const requestedQuantity = Number(
          item.qty
        );

        if (currentStock <= 0) {
          throw new Error(
            `${product.name} is currently out of stock.`
          );
        }

        if (
          requestedQuantity >
          currentStock
        ) {
          throw new Error(
            `${product.name} only has ${currentStock} available. Please update your cart quantity.`
          );
        }

        const normalPrice = Number(
          product.price || 0
        );

        const salePrice = Number(
          product.salePrice || 0
        );

        const onSale =
          salePrice > 0 &&
          salePrice < normalPrice;

        const currentPrice = onSale
          ? salePrice
          : normalPrice;

        checkedProducts.push({
          id: product.id,
          name: product.name,
          price: currentPrice,
          originalPrice: normalPrice,
          qty: requestedQuantity,
          image:
            product.images?.[0] || '',
        });
      }

      /*
       * Calculate totals using the current
       * Firestore prices rather than prices
       * stored in the customer's browser.
       */
      const verifiedSubtotal =
        checkedProducts.reduce(
          (total, item) =>
            total +
            item.price * item.qty,
          0
        );

      const verifiedTotal =
        verifiedSubtotal + delivery;

      /*
       * Create the order.
       *
       * Stock is NOT reduced here yet.
       * We'll handle stock securely when
       * payment processing is connected.
       */
      const orderRef = await addDoc(
        collection(db, 'orders'),
        {
          customer: {
            name: form.name.trim(),
            phone: form.phone.trim(),
            address:
              form.address.trim(),
            city: form.city.trim(),
          },

          items: checkedProducts,

          subtotal: verifiedSubtotal,
          delivery,
          total: verifiedTotal,

          status: 'pending',
          paymentStatus: 'unpaid',

          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        }
      );

      setOrderNumber(orderRef.id);
      setSuccess(true);

      setStatus(
        'Your order has been received successfully.'
      );

      clear();
    } catch (error) {
      console.error(error);

      setStatus(
        error.message ||
        'Something went wrong. Please try again.'
      );
    } finally {
      setBusy(false);
    }
  }

  /*
   * ORDER SUCCESS
   */
  if (success) {
    return (
      <section className="section checkout">
        <div className="checkout-success">
          <p className="eyebrow">
            HONEY & HOME CO
          </p>

          <h1>Thank you!</h1>

          <p>
            Your order has been received
            successfully.
          </p>

          <div className="order-number-box">
            <small>
              YOUR ORDER NUMBER
            </small>

            <strong>
              #
              {orderNumber
                .slice(0, 8)
                .toUpperCase()}
            </strong>
          </div>

          <p>
            Your order is currently awaiting
            payment.
          </p>

          <p>
            Please keep your order number for
            reference.
          </p>

          <Link
            className="button"
            to="/shop"
          >
            Continue shopping
          </Link>
        </div>
      </section>
    );
  }

  /*
   * EMPTY CART
   */
  if (!items.length) {
    return (
      <section className="section empty">
        <h1>Your cart is empty</h1>

        <p>
          Add some Honey & Home favourites
          before checking out.
        </p>

        <Link
          className="button"
          to="/shop"
        >
          Start shopping
        </Link>
      </section>
    );
  }

  /*
   * CHECKOUT
   */
  return (
    <section className="section checkout">
      <p className="eyebrow">
        HONEY & HOME CO
      </p>

      <h1>Checkout</h1>

      <div className="notice">
        Payment options are being connected.
        Your order will currently be saved as
        awaiting payment.
      </div>

      <form onSubmit={submit}>
        <label>
          Full name

          <input
            required
            type="text"
            value={form.name}
            onChange={(event) =>
              setForm({
                ...form,
                name: event.target.value,
              })
            }
            placeholder="Your full name"
          />
        </label>

        <label>
          WhatsApp number

          <input
            required
            type="tel"
            value={form.phone}
            onChange={(event) =>
              setForm({
                ...form,
                phone: event.target.value,
              })
            }
            placeholder="e.g. 078 123 4567"
          />
        </label>

        <label>
          Delivery address

          <textarea
            required
            rows="4"
            value={form.address}
            onChange={(event) =>
              setForm({
                ...form,
                address:
                  event.target.value,
              })
            }
            placeholder="Street address, complex/house number..."
          />
        </label>

        <label>
          City / Area

          <input
            required
            type="text"
            value={form.city}
            onChange={(event) =>
              setForm({
                ...form,
                city: event.target.value,
              })
            }
            placeholder="e.g. Rustenburg"
          />
        </label>

        {/* ORDER SUMMARY */}

        <div className="checkout-items">
          <h3>Order summary</h3>

          {items.map((item) => (
            <div
              className="checkout-item"
              key={item.id}
            >
              <span>
                {item.name} × {item.qty}
              </span>

              <strong>
                R
                {(
                  Number(item.price) *
                  Number(item.qty)
                ).toFixed(2)}
              </strong>
            </div>
          ))}
        </div>

        {/* TOTALS */}

        <div className="totals">
          <p>
            Products

            <b>
              R{subtotal.toFixed(2)}
            </b>
          </p>

          <p>
            Delivery

            <b>R150.00</b>
          </p>

          <h3>
            Total

            <b>
              R
              {displayedTotal.toFixed(2)}
            </b>
          </h3>
        </div>

        <button
          className="button"
          disabled={busy}
        >
          {busy
            ? 'Checking your order...'
            : `Place order — R${displayedTotal.toFixed(
              2
            )}`}
        </button>

        {status && (
          <p className="checkout-message">
            {status}
          </p>
        )}
      </form>
    </section>
  );
}