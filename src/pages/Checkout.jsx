import { useState } from 'react';
import {
  addDoc,
  collection,
  serverTimestamp,
} from 'firebase/firestore';

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

  const delivery = 150;
  const total = subtotal + delivery;

  async function submit(event) {
    event.preventDefault();

    if (!items.length) {
      return;
    }

    try {
      await addDoc(
        collection(db, 'orders'),
        {
          customer: form,

          items: items.map(
            ({
              id,
              name,
              price,
              qty,
            }) => ({
              id,
              name,
              price,
              qty,
            })
          ),

          subtotal,
          delivery,
          total,

          status: 'pending-payment',

          createdAt: serverTimestamp(),
        }
      );

      setStatus(
        'Order saved. Payment options will be connected after your merchant accounts are approved.'
      );

      clear();
    } catch (error) {
      setStatus(error.message);
    }
  }

  return (
    <section className="section checkout">
      <h1>Checkout</h1>

      <div className="notice">
        Secure card, Payflex, PayJustNow and Happy Pay
        integrations are prepared as the next step.
        Never enter card numbers directly into this
        website until a payment gateway is connected.
      </div>

      <form onSubmit={submit}>
        <label>
          Full name

          <input
            required
            value={form.name}
            onChange={(event) =>
              setForm({
                ...form,
                name: event.target.value,
              })
            }
          />
        </label>

        <label>
          WhatsApp number

          <input
            required
            value={form.phone}
            onChange={(event) =>
              setForm({
                ...form,
                phone: event.target.value,
              })
            }
          />
        </label>

        <label>
          Delivery address

          <textarea
            required
            value={form.address}
            onChange={(event) =>
              setForm({
                ...form,
                address: event.target.value,
              })
            }
          />
        </label>

        <label>
          City / Area

          <input
            required
            value={form.city}
            onChange={(event) =>
              setForm({
                ...form,
                city: event.target.value,
              })
            }
          />
        </label>

        <div className="totals">
          <p>
            Products
            <b>R{subtotal.toFixed(2)}</b>
          </p>

          <p>
            Delivery
            <b>R150.00</b>
          </p>

          <h3>
            Total
            <b>R{total.toFixed(2)}</b>
          </h3>
        </div>

        <button className="button">
          Create order
        </button>

        {status && (
          <p>{status}</p>
        )}
      </form>
    </section>
  );
}