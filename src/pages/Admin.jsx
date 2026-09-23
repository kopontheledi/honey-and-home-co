import { useEffect, useState } from 'react';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import {
  onAuthStateChanged,
  signOut,
} from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import {
  Edit3,
  LogOut,
  Package,
  Plus,
  RefreshCw,
  ShoppingBag,
  Trash2,
  Upload,
  X,
} from 'lucide-react';

import { db, auth } from '../lib/firebase';
import { uploadImages } from '../lib/cloudinary';

const categories = [
  'Bowls',
  'Cups',
  'Standing Mirrors',
  'Noodle Boxes',
  'Plates',
  'Pots',
  'Glasses',
  'Other',
];

const emptyForm = {
  name: '',
  price: '',
  salePrice: '',
  category: 'Bowls',
  description: '',
  stock: '',
};

export default function Admin() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [checkingAuth, setCheckingAuth] =
    useState(true);

  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  const [adminTab, setAdminTab] =
    useState('products');

  const [form, setForm] =
    useState(emptyForm);

  const [files, setFiles] = useState([]);
  const [existingImages, setExistingImages] =
    useState([]);

  const [editingId, setEditingId] =
    useState(null);

  const [saving, setSaving] =
    useState(false);

  const [message, setMessage] =
    useState('');

  /* =========================
     AUTH
  ========================= */

  useEffect(() => {
    const unsubscribe =
      onAuthStateChanged(
        auth,
        (currentUser) => {
          if (!currentUser) {
            navigate('/admin/login');
            return;
          }

          setUser(currentUser);
          setCheckingAuth(false);
        }
      );

    return unsubscribe;
  }, [navigate]);

  /* =========================
     LOAD ADMIN DATA
  ========================= */

  useEffect(() => {
    if (!user) {
      return;
    }

    loadProducts();
    loadOrders();
  }, [user]);

  async function loadProducts() {
    try {
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
    } catch (error) {
      console.error(error);
      setMessage(error.message);
    }
  }

  async function loadOrders() {
    try {
      const snapshot = await getDocs(
        query(
          collection(db, 'orders'),
          orderBy('createdAt', 'desc')
        )
      );

      setOrders(
        snapshot.docs.map((document) => ({
          id: document.id,
          ...document.data(),
        }))
      );
    } catch (error) {
      console.error(error);
      setMessage(error.message);
    }
  }

  /* =========================
     FORM
  ========================= */

  function change(event) {
    const { name, value } =
      event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function resetForm() {
    setForm(emptyForm);
    setFiles([]);
    setExistingImages([]);
    setEditingId(null);
  }

  /* =========================
     SAVE PRODUCT
  ========================= */

  async function submit(event) {
    event.preventDefault();

    if (saving) {
      return;
    }

    setMessage('');

    const normalPrice =
      Number(form.price);

    const salePrice =
      form.salePrice !== ''
        ? Number(form.salePrice)
        : null;

    const stock =
      Number(form.stock);

    if (!form.name.trim()) {
      setMessage(
        'Please enter a product name.'
      );
      return;
    }

    if (
      Number.isNaN(normalPrice) ||
      normalPrice < 0
    ) {
      setMessage(
        'Please enter a valid price.'
      );
      return;
    }

    if (
      salePrice !== null &&
      (
        Number.isNaN(salePrice) ||
        salePrice < 0
      )
    ) {
      setMessage(
        'Please enter a valid sale price.'
      );
      return;
    }

    if (
      salePrice !== null &&
      salePrice >= normalPrice
    ) {
      setMessage(
        'Sale price must be lower than the normal price.'
      );
      return;
    }

    if (
      Number.isNaN(stock) ||
      stock < 0
    ) {
      setMessage(
        'Please enter a valid stock quantity.'
      );
      return;
    }

    setSaving(true);

    try {
      let uploadedImages = [];

      if (files.length) {
        uploadedImages =
          await uploadImages(files);
      }

      const images = [
        ...existingImages,
        ...uploadedImages,
      ];

      const productData = {
        name: form.name.trim(),

        price: normalPrice,

        salePrice,

        category: form.category,

        description:
          form.description.trim(),

        stock,

        images,

        updatedAt: serverTimestamp(),
      };

      if (editingId) {
        await updateDoc(
          doc(
            db,
            'products',
            editingId
          ),
          productData
        );

        setMessage(
          'Product updated successfully.'
        );
      } else {
        await addDoc(
          collection(db, 'products'),
          {
            ...productData,
            createdAt:
              serverTimestamp(),
          }
        );

        setMessage(
          'Product added successfully.'
        );
      }

      resetForm();
      await loadProducts();
    } catch (error) {
      console.error(error);

      setMessage(
        error.message ||
          'Something went wrong while saving the product.'
      );
    } finally {
      setSaving(false);
    }
  }

  /* =========================
     EDIT PRODUCT
  ========================= */

  function startEdit(product) {
    setEditingId(product.id);

    setForm({
      name: product.name || '',

      price:
        product.price ?? '',

      salePrice:
        product.salePrice ?? '',

      category:
        product.category ||
        'Other',

      description:
        product.description ||
        '',

      stock:
        product.stock ?? 0,
    });

    setExistingImages(
      product.images || []
    );

    setFiles([]);

    setAdminTab('products');

    setMessage(
      `Editing ${product.name}`
    );

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }

  /* =========================
     DELETE PRODUCT
  ========================= */

  async function removeProduct(product) {
    const confirmed =
      window.confirm(
        `Delete "${product.name}"? This cannot be undone.`
      );

    if (!confirmed) {
      return;
    }

    try {
      await deleteDoc(
        doc(
          db,
          'products',
          product.id
        )
      );

      if (
        editingId === product.id
      ) {
        resetForm();
      }

      await loadProducts();

      setMessage(
        'Product deleted successfully.'
      );
    } catch (error) {
      console.error(error);
      setMessage(error.message);
    }
  }

  /* =========================
     REMOVE EXISTING IMAGE
  ========================= */

  function removeExistingImage(
    imageUrl
  ) {
    setExistingImages(
      (currentImages) =>
        currentImages.filter(
          (image) =>
            image !== imageUrl
        )
    );
  }

  /* =========================
     REMOVE NEW IMAGE
  ========================= */

  function removeSelectedFile(
    indexToRemove
  ) {
    setFiles((currentFiles) =>
      currentFiles.filter(
        (_, index) =>
          index !== indexToRemove
      )
    );
  }

  /* =========================
     ORDER STATUS
  ========================= */

  async function updateOrderStatus(
    orderId,
    status
  ) {
    try {
      await updateDoc(
        doc(db, 'orders', orderId),
        {
          status,
          updatedAt:
            serverTimestamp(),
        }
      );

      await loadOrders();

      setMessage(
        'Order status updated successfully.'
      );
    } catch (error) {
      console.error(error);
      setMessage(error.message);
    }
  }

  /* =========================
     PAYMENT STATUS
  ========================= */

  async function updatePaymentStatus(
    orderId,
    paymentStatus
  ) {
    try {
      await updateDoc(
        doc(db, 'orders', orderId),
        {
          paymentStatus,
          updatedAt:
            serverTimestamp(),
        }
      );

      await loadOrders();

      setMessage(
        'Payment status updated successfully.'
      );
    } catch (error) {
      console.error(error);
      setMessage(error.message);
    }
  }

  /* =========================
     LOGOUT
  ========================= */

  async function logout() {
    try {
      await signOut(auth);
      navigate('/admin/login');
    } catch (error) {
      console.error(error);
      setMessage(error.message);
    }
  }

  /* =========================
     DATE FORMAT
  ========================= */

  function formatDate(timestamp) {
    if (!timestamp) {
      return 'Pending date';
    }

    try {
      return timestamp
        .toDate()
        .toLocaleString(
          'en-ZA',
          {
            dateStyle: 'medium',
            timeStyle: 'short',
          }
        );
    } catch {
      return 'Pending date';
    }
  }

  /* =========================
     AUTH LOADING
  ========================= */

  if (checkingAuth) {
    return (
      <section className="section">
        <p>Checking admin...</p>
      </section>
    );
  }

  /* =========================
     ADMIN
  ========================= */

  return (
    <section className="section admin">
      {/* HEADER */}

      <div className="admin-header">
        <div>
          <p className="eyebrow">
            HONEY & HOME CO
          </p>

          <h1>Admin</h1>

          <p>
            Manage products and customer
            orders.
          </p>
        </div>

        <button
          type="button"
          className="outline"
          onClick={logout}
        >
          <LogOut size={17} />
          Logout
        </button>
      </div>

      {/* MESSAGE */}

      {message && (
        <div className="notice">
          {message}
        </div>
      )}

      {/* TABS */}

      <div className="admin-tabs">
        <button
          type="button"
          className={
            adminTab === 'products'
              ? 'active'
              : ''
          }
          onClick={() =>
            setAdminTab('products')
          }
        >
          <Package size={17} />
          Products
          <span>
            {products.length}
          </span>
        </button>

        <button
          type="button"
          className={
            adminTab === 'orders'
              ? 'active'
              : ''
          }
          onClick={() =>
            setAdminTab('orders')
          }
        >
          <ShoppingBag size={17} />
          Orders
          <span>
            {orders.length}
          </span>
        </button>
      </div>

      {/* =========================
          PRODUCTS TAB
      ========================= */}

      {adminTab === 'products' && (
        <>
          <div className="admin-grid">
            {/* PRODUCT FORM */}

            <form
              className="admin-form"
              onSubmit={submit}
            >
              <div className="admin-form-heading">
                <div>
                  <p className="eyebrow">
                    {editingId
                      ? 'EDIT PRODUCT'
                      : 'NEW PRODUCT'}
                  </p>

                  <h2>
                    {editingId
                      ? 'Update product'
                      : 'Add a product'}
                  </h2>
                </div>

                {editingId && (
                  <button
                    type="button"
                    className="icon-button"
                    onClick={resetForm}
                    aria-label="Cancel editing"
                  >
                    <X />
                  </button>
                )}
              </div>

              {/* NAME */}

              <label>
                Product name

                <input
                  required
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={change}
                  placeholder="e.g. Ceramic Serving Bowl"
                />
              </label>

              {/* PRICE */}

              <label>
                Normal price

                <input
                  required
                  type="number"
                  name="price"
                  min="0"
                  step="0.01"
                  value={form.price}
                  onChange={change}
                  placeholder="e.g. 399"
                />
              </label>

              {/* SALE PRICE */}

              <label>
                Sale price
                <small>
                  Optional — leave empty if
                  this product is not on sale.
                </small>

                <input
                  type="number"
                  name="salePrice"
                  min="0"
                  step="0.01"
                  value={
                    form.salePrice
                  }
                  onChange={change}
                  placeholder="e.g. 299"
                />
              </label>

              {/* CATEGORY */}

              <label>
                Category

                <select
                  name="category"
                  value={
                    form.category
                  }
                  onChange={change}
                >
                  {categories.map(
                    (category) => (
                      <option
                        key={
                          category
                        }
                        value={
                          category
                        }
                      >
                        {category}
                      </option>
                    )
                  )}
                </select>
              </label>

              {/* STOCK */}

              <label>
                Stock quantity

                <input
                  required
                  type="number"
                  name="stock"
                  min="0"
                  step="1"
                  value={form.stock}
                  onChange={change}
                  placeholder="e.g. 10"
                />

                <small>
                  Enter 0 when the
                  product is out of
                  stock.
                </small>
              </label>

              {/* DESCRIPTION */}

              <label>
                Description

                <textarea
                  name="description"
                  rows="5"
                  value={
                    form.description
                  }
                  onChange={change}
                  placeholder="Tell customers about this product..."
                />
              </label>

              {/* EXISTING IMAGES */}

              {existingImages.length >
                0 && (
                <div className="admin-images">
                  <strong>
                    Current images
                  </strong>

                  <div className="admin-image-grid">
                    {existingImages.map(
                      (
                        image,
                        index
                      ) => (
                        <div
                          className="admin-image-preview"
                          key={
                            image +
                            index
                          }
                        >
                          <img
                            src={
                              image
                            }
                            alt=""
                          />

                          <button
                            type="button"
                            onClick={() =>
                              removeExistingImage(
                                image
                              )
                            }
                            aria-label="Remove image"
                          >
                            <X
                              size={
                                15
                              }
                            />
                          </button>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}

              {/* NEW IMAGES */}

              <label className="upload-box">
                <Upload size={23} />

                <strong>
                  Upload product images
                </strong>

                <span>
                  You can select multiple
                  images.
                </span>

                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(
                    event
                  ) =>
                    setFiles(
                      Array.from(
                        event.target
                          .files
                      )
                    )
                  }
                />
              </label>

              {/* SELECTED FILES */}

              {files.length > 0 && (
                <div className="selected-files">
                  <strong>
                    New images
                  </strong>

                  {files.map(
                    (
                      file,
                      index
                    ) => (
                      <div
                        key={`${file.name}-${index}`}
                        className="selected-file"
                      >
                        <span>
                          {
                            file.name
                          }
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            removeSelectedFile(
                              index
                            )
                          }
                        >
                          <X
                            size={
                              15
                            }
                          />
                        </button>
                      </div>
                    )
                  )}
                </div>
              )}

              {/* SAVE */}

              <button
                className="button"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <RefreshCw
                      size={17}
                    />
                    Saving...
                  </>
                ) : editingId ? (
                  <>
                    <Edit3
                      size={17}
                    />
                    Update product
                  </>
                ) : (
                  <>
                    <Plus
                      size={17}
                    />
                    Add product
                  </>
                )}
              </button>

              {editingId && (
                <button
                  type="button"
                  className="button secondary"
                  onClick={resetForm}
                >
                  Cancel editing
                </button>
              )}
            </form>

            {/* PRODUCT LIST */}

            <div className="admin-products">
              <div className="admin-list-heading">
                <div>
                  <p className="eyebrow">
                    YOUR STORE
                  </p>

                  <h2>
                    Products
                  </h2>
                </div>

                <button
                  type="button"
                  className="icon-button"
                  onClick={
                    loadProducts
                  }
                  aria-label="Refresh products"
                >
                  <RefreshCw />
                </button>
              </div>

              {products.length ? (
                <div className="admin-product-list">
                  {products.map(
                    (product) => {
                      const normalPrice =
                        Number(
                          product.price ||
                            0
                        );

                      const salePrice =
                        Number(
                          product.salePrice ||
                            0
                        );

                      const onSale =
                        salePrice >
                          0 &&
                        salePrice <
                          normalPrice;

                      const stock =
                        Number(
                          product.stock ??
                            0
                        );

                      return (
                        <article
                          className="admin-product"
                          key={
                            product.id
                          }
                        >
                          <div className="admin-product-image">
                            <img
                              src={
                                product
                                  .images?.[0] ||
                                'https://placehold.co/120?text=Product'
                              }
                              alt={
                                product.name
                              }
                            />

                            {onSale && (
                              <span className="admin-sale-badge">
                                SALE
                              </span>
                            )}
                          </div>

                          <div className="admin-product-info">
                            <small>
                              {product.category ||
                                'Home'}
                            </small>

                            <h3>
                              {
                                product.name
                              }
                            </h3>

                            {onSale ? (
                              <div className="admin-sale-price">
                                <strong>
                                  R
                                  {salePrice.toFixed(
                                    2
                                  )}
                                </strong>

                                <span>
                                  R
                                  {normalPrice.toFixed(
                                    2
                                  )}
                                </span>
                              </div>
                            ) : (
                              <strong>
                                R
                                {normalPrice.toFixed(
                                  2
                                )}
                              </strong>
                            )}

                            <p
                              className={
                                stock <=
                                0
                                  ? 'stock-status out'
                                  : 'stock-status'
                              }
                            >
                              {stock <=
                              0
                                ? 'Out of stock'
                                : `${stock} in stock`}
                            </p>
                          </div>

                          <div className="admin-product-actions">
                            <button
                              type="button"
                              className="icon-button"
                              onClick={() =>
                                startEdit(
                                  product
                                )
                              }
                              aria-label={`Edit ${product.name}`}
                            >
                              <Edit3 />
                            </button>

                            <button
                              type="button"
                              className="icon-button danger"
                              onClick={() =>
                                removeProduct(
                                  product
                                )
                              }
                              aria-label={`Delete ${product.name}`}
                            >
                              <Trash2 />
                            </button>
                          </div>
                        </article>
                      );
                    }
                  )}
                </div>
              ) : (
                <div className="empty admin-empty">
                  <Package
                    size={35}
                  />

                  <h3>
                    No products yet
                  </h3>

                  <p>
                    Add your first
                    product using the
                    form.
                  </p>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* =========================
          ORDERS TAB
      ========================= */}

      {adminTab === 'orders' && (
        <div className="admin-orders">
          <div className="orders-heading">
            <div>
              <p className="eyebrow">
                CUSTOMER ORDERS
              </p>

              <h2>Orders</h2>
            </div>

            <button
              type="button"
              className="icon-button"
              onClick={loadOrders}
              aria-label="Refresh orders"
            >
              <RefreshCw />
            </button>
          </div>

          {orders.length ? (
            <div className="orders-list">
              {orders.map(
                (order) => (
                  <article
                    className="admin-order-card"
                    key={order.id}
                  >
                    {/* ORDER HEADER */}

                    <div className="order-top">
                      <div>
                        <small>
                          ORDER
                        </small>

                        <strong>
                          #
                          {order.id
                            .slice(
                              0,
                              8
                            )
                            .toUpperCase()}
                        </strong>

                        <p>
                          {formatDate(
                            order.createdAt
                          )}
                        </p>
                      </div>

                      <div className="order-total">
                        <small>
                          TOTAL
                        </small>

                        <strong>
                          R
                          {Number(
                            order.total ||
                              0
                          ).toFixed(
                            2
                          )}
                        </strong>
                      </div>
                    </div>

                    {/* CUSTOMER */}

                    <div className="order-customer">
                      <h3>
                        Customer
                      </h3>

                      <p>
                        <strong>
                          Name:
                        </strong>{' '}
                        {order
                          .customer
                          ?.name ||
                          '—'}
                      </p>

                      <p>
                        <strong>
                          WhatsApp:
                        </strong>{' '}
                        {order
                          .customer
                          ?.phone ||
                          '—'}
                      </p>

                      <p>
                        <strong>
                          Address:
                        </strong>{' '}
                        {order
                          .customer
                          ?.address ||
                          '—'}
                      </p>

                      <p>
                        <strong>
                          City / Area:
                        </strong>{' '}
                        {order
                          .customer
                          ?.city ||
                          '—'}
                      </p>
                    </div>

                    {/* PRODUCTS */}

                    <div className="order-products">
                      <h3>
                        Products
                      </h3>

                      {order.items?.map(
                        (
                          item,
                          index
                        ) => (
                          <div
                            className="order-product"
                            key={`${item.id}-${index}`}
                          >
                            <img
                              src={
                                item.image ||
                                'https://placehold.co/80?text=Product'
                              }
                              alt={
                                item.name
                              }
                            />

                            <div>
                              <strong>
                                {
                                  item.name
                                }
                              </strong>

                              <small>
                                Qty:{' '}
                                {
                                  item.qty
                                }
                              </small>

                              {item.originalPrice &&
                                Number(
                                  item.originalPrice
                                ) >
                                  Number(
                                    item.price
                                  ) && (
                                  <small>
                                    Sale
                                    item
                                  </small>
                                )}
                            </div>

                            <span>
                              R
                              {(
                                Number(
                                  item.price
                                ) *
                                Number(
                                  item.qty
                                )
                              ).toFixed(
                                2
                              )}
                            </span>
                          </div>
                        )
                      )}
                    </div>

                    {/* TOTALS */}

                    <div className="order-money">
                      <p>
                        <span>
                          Subtotal
                        </span>

                        <strong>
                          R
                          {Number(
                            order.subtotal ||
                              0
                          ).toFixed(
                            2
                          )}
                        </strong>
                      </p>

                      <p>
                        <span>
                          Delivery
                        </span>

                        <strong>
                          R
                          {Number(
                            order.delivery ||
                              0
                          ).toFixed(
                            2
                          )}
                        </strong>
                      </p>

                      <p className="order-grand-total">
                        <span>
                          Total
                        </span>

                        <strong>
                          R
                          {Number(
                            order.total ||
                              0
                          ).toFixed(
                            2
                          )}
                        </strong>
                      </p>
                    </div>

                    {/* ORDER CONTROLS */}

                    <div className="order-controls">
                      <label>
                        Order status

                        <select
                          value={
                            order.status ||
                            'pending'
                          }
                          onChange={(
                            event
                          ) =>
                            updateOrderStatus(
                              order.id,
                              event
                                .target
                                .value
                            )
                          }
                        >
                          <option value="pending">
                            Pending
                          </option>

                          <option value="confirmed">
                            Confirmed
                          </option>

                          <option value="preparing">
                            Preparing
                          </option>

                          <option value="ready">
                            Ready
                          </option>

                          <option value="shipped">
                            Shipped
                          </option>

                          <option value="completed">
                            Completed
                          </option>

                          <option value="cancelled">
                            Cancelled
                          </option>
                        </select>
                      </label>

                      <label>
                        Payment status

                        <select
                          value={
                            order.paymentStatus ||
                            'unpaid'
                          }
                          onChange={(
                            event
                          ) =>
                            updatePaymentStatus(
                              order.id,
                              event
                                .target
                                .value
                            )
                          }
                        >
                          <option value="unpaid">
                            Unpaid
                          </option>

                          <option value="paid">
                            Paid
                          </option>

                          <option value="refunded">
                            Refunded
                          </option>
                        </select>
                      </label>
                    </div>
                  </article>
                )
              )}
            </div>
          ) : (
            <div className="empty admin-empty">
              <ShoppingBag
                size={35}
              />

              <h3>
                No orders yet
              </h3>

              <p>
                Customer orders will
                appear here.
              </p>
            </div>
          )}
        </div>
      )}
    </section>
  );
}