import { useEffect, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
} from 'firebase/firestore';
import { Link } from 'react-router-dom';

import { auth, db } from '../lib/firebase';
import { uploadImages } from '../lib/cloudinary';

const empty = {
  name: '',
  price: '',
  category: 'Bowls',
  description: '',
};

export default function Admin() {
  const [user, setUser] = useState(undefined);
  const [form, setForm] = useState(empty);
  const [files, setFiles] = useState([]);
  const [products, setProducts] = useState([]);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    return onAuthStateChanged(auth, setUser);
  }, []);

  async function load() {
    const snapshot = await getDocs(
      query(
        collection(db, 'products'),
        orderBy('createdAt', 'desc')
      )
    );

    setProducts(
      snapshot.docs.map((document) => ({
        id: document.id,
        ...document.data(),
      }))
    );
  }

  useEffect(() => {
    if (user) {
      load();
    }
  }, [user]);

  if (user === undefined) {
    return (
      <section className="section">
        Checking login...
      </section>
    );
  }

  if (!user) {
    return (
      <section className="section empty">
        <h1>Admin only</h1>

        <p>Please sign in before adding products.</p>

        <Link
          className="button"
          to="/admin/login"
        >
          Admin login
        </Link>
      </section>
    );
  }

  async function submit(event) {
    event.preventDefault();

    setBusy(true);
    setMessage('');

    try {
      const images = files.length
        ? await uploadImages(files)
        : [];

      await addDoc(collection(db, 'products'), {
        ...form,
        price: Number(form.price),
        images,
        createdAt: serverTimestamp(),
      });

      setForm(empty);
      setFiles([]);
      setMessage('Product added successfully.');

      await load();
    } catch (error) {
      setMessage(error.message);
    } finally {
      setBusy(false);
    }
  }

  async function del(id) {
    if (confirm('Delete this product?')) {
      await deleteDoc(
        doc(db, 'products', id)
      );

      load();
    }
  }

  return (
    <section className="section admin">
      <div className="admin-head">
        <div>
          <p className="eyebrow">
            HONEY & HOME CO
          </p>

          <h1>Product admin</h1>
        </div>

        <button
          className="outline-button"
          onClick={() => signOut(auth)}
        >
          Sign out
        </button>
      </div>

      <form
        className="admin-form"
        onSubmit={submit}
      >
        <label>
          Product name

          <input
            required
            value={form.name}
            onChange={(event) =>
              setForm({
                ...form,
                name: event.target.value,
              })
            }
            placeholder="e.g. Ribbed glass set"
          />
        </label>

        <label>
          Price (R)

          <input
            required
            type="number"
            min="0"
            step="0.01"
            value={form.price}
            onChange={(event) =>
              setForm({
                ...form,
                price: event.target.value,
              })
            }
          />
        </label>

        <label>
          Category

          <select
            value={form.category}
            onChange={(event) =>
              setForm({
                ...form,
                category: event.target.value,
              })
            }
          >
            {[
              'Bowls',
              'Cups',
              'Standing Mirrors',
              'Noodle Boxes',
              'Plates',
              'Pots',
              'Glasses',
              'Other',
            ].map((category) => (
              <option key={category}>
                {category}
              </option>
            ))}
          </select>
        </label>

        <label>
          Description

          <textarea
            value={form.description}
            onChange={(event) =>
              setForm({
                ...form,
                description: event.target.value,
              })
            }
          />
        </label>

        <label>
          Product images

          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(event) =>
              setFiles([
                ...event.target.files,
              ])
            }
          />

          <small>
            {files.length} image(s) selected
          </small>
        </label>

        <button
          className="button"
          disabled={busy}
        >
          {busy
            ? 'Uploading & saving...'
            : 'Add product'}
        </button>

        {message && (
          <p>{message}</p>
        )}
      </form>

      <h2>Products</h2>

      <div className="admin-products">
        {products.map((product) => (
          <div key={product.id}>
            <img
              src={
                product.images?.[0] ||
                'https://placehold.co/90'
              }
              alt=""
            />

            <span>
              <b>{product.name}</b>

              <small>
                R{Number(product.price).toFixed(2)}
              </small>
            </span>

            <button
              onClick={() => del(product.id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}