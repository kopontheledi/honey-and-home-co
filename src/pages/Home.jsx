import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
} from 'firebase/firestore';
import {
  ArrowRight,
  Heart,
  MessageCircle,
  PackageCheck,
  ShoppingBag,
  Truck,
} from 'lucide-react';

import { db } from '../lib/firebase';
import ProductCard from '../components/ProductCard';
import WhatsAppButton from '../components/WhatsAppButton';

export default function Home() {
  const [newProducts, setNewProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const categories = [
    {
      name: 'Bowls',
      description: 'Everyday serving made beautiful.',
      icon: '🥣',
    },
    {
      name: 'Cups',
      description: 'For coffee, tea and cosy moments.',
      icon: '☕',
    },
    {
      name: 'Standing Mirrors',
      description: 'Simple pieces that transform a room.',
      icon: '🪞',
    },
    {
      name: 'Plates',
      description: 'Set the table your way.',
      icon: '🍽️',
    },
    {
      name: 'Pots',
      description: 'Kitchen essentials for everyday cooking.',
      icon: '🍲',
    },
    {
      name: 'Glasses',
      description: 'Beautiful glassware for your table.',
      icon: '🥛',
    },
  ];

  useEffect(() => {
    async function loadNewArrivals() {
      try {
        const snapshot = await getDocs(
          query(
            collection(db, 'products'),
            orderBy('createdAt', 'desc'),
            limit(4)
          )
        );

        setNewProducts(
          snapshot.docs.map((document) => ({
            id: document.id,
            ...document.data(),
          }))
        );
      } catch (error) {
        console.error(
          'Could not load new arrivals:',
          error
        );
      } finally {
        setLoading(false);
      }
    }

    loadNewArrivals();
  }, []);

  return (
    <>
      {/* =========================
          HERO
      ========================= */}

      <section className="home-hero">
        <div className="home-hero-content">
          <p className="eyebrow">
            WELCOME TO HONEY & HOME CO
          </p>

          <h1>
            Make everyday living feel a little{' '}
            <em>more special.</em>
          </h1>

          <p className="home-hero-text">
            Beautiful and practical finds for your
            kitchen, table and home — thoughtfully
            selected for everyday living.
          </p>

          <div className="home-hero-buttons">
            <Link
              className="button"
              to="/shop"
            >
              <ShoppingBag size={18} />
              Shop collection
            </Link>

            <Link
              className="home-text-link"
              to="/about"
            >
              Our story
              <ArrowRight size={17} />
            </Link>
          </div>
        </div>

        <div className="home-hero-art">
          <div className="hero-brand-card">
            <span className="hero-small">
              HOME • KITCHEN • LIVING
            </span>

            <strong>
              Honey
              <span>&</span>
              Home
            </strong>

            <p>
              little things,
              <br />
              lovely homes.
            </p>
          </div>
        </div>
      </section>

      {/* =========================
          BENEFITS
      ========================= */}

      <section className="home-benefits">
        <div>
          <Heart size={22} />

          <span>
            <strong>Chosen with care</strong>
            <small>
              Beautiful everyday finds
            </small>
          </span>
        </div>

        <div>
          <Truck size={22} />

          <span>
            <strong>SA delivery</strong>
            <small>
              Delivery across South Africa
            </small>
          </span>
        </div>

        <div>
          <MessageCircle size={22} />

          <span>
            <strong>We're on WhatsApp</strong>
            <small>
              Easy product enquiries
            </small>
          </span>
        </div>

        <div>
          <PackageCheck size={22} />

          <span>
            <strong>Stock you can see</strong>
            <small>
              Check availability while shopping
            </small>
          </span>
        </div>
      </section>

      {/* =========================
          CATEGORIES
      ========================= */}

      <section className="section home-section">
        <div className="home-section-heading">
          <div>
            <p className="eyebrow">
              SHOP BY CATEGORY
            </p>

            <h2>
              Find something for your home
            </h2>
          </div>

          <Link to="/shop">
            Shop all
            <ArrowRight size={17} />
          </Link>
        </div>

        <div className="home-category-grid">
          {categories.map((category) => (
            <Link
              key={category.name}
              to={`/shop?category=${encodeURIComponent(
                category.name
              )}`}
              className="home-category-card"
            >
              <span className="category-icon">
                {category.icon}
              </span>

              <div>
                <h3>{category.name}</h3>

                <p>
                  {category.description}
                </p>

                <span className="category-shop">
                  Shop now
                  <ArrowRight size={15} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* =========================
          NEW ARRIVALS
      ========================= */}

      <section className="section home-section home-arrivals">
        <div className="home-section-heading">
          <div>
            <p className="eyebrow">
              JUST IN
            </p>

            <h2>New arrivals</h2>

            <p>
              Fresh finds recently added to
              Honey & Home Co.
            </p>
          </div>

          <Link to="/shop">
            View all
            <ArrowRight size={17} />
          </Link>
        </div>

        {loading ? (
          <div className="home-loading">
            Loading new arrivals...
          </div>
        ) : newProducts.length ? (
          <div className="products">
            {newProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
          </div>
        ) : (
          <div className="empty">
            <h3>New products coming soon</h3>

            <p>
              Keep an eye on this space for
              our latest finds.
            </p>
          </div>
        )}
      </section>

      {/* =========================
          STORY
      ========================= */}

      <section className="home-story">
        <div className="home-story-art">
          <span>Honey</span>
          <strong>&</strong>
          <span>Home</span>
        </div>

        <div className="home-story-content">
          <p className="eyebrow">
            OUR HOME
          </p>

          <h2>
            It's the little things.
          </h2>

          <p>
            A favourite cup. A beautiful plate.
            A mirror that finishes the room.
            A pot you reach for every day.
          </p>

          <p>
            Honey & Home Co is about finding
            those simple pieces that make your
            space feel more like yours.
          </p>

          <Link
            className="home-text-link"
            to="/about"
          >
            More about us
            <ArrowRight size={17} />
          </Link>
        </div>
      </section>

      {/* =========================
          DELIVERY CTA
      ========================= */}

      <section className="section">
        <div className="home-delivery">
          <div>
            <p className="eyebrow">
              DELIVERED TO YOUR DOOR
            </p>

            <h2>
              Found something you love?
            </h2>

            <p>
              We currently deliver within
              South Africa. Website orders have
              a standard R150 delivery fee.
            </p>
          </div>

          <div className="home-delivery-buttons">
            <Link
              className="button"
              to="/shop"
            >
              Start shopping
              <ArrowRight size={17} />
            </Link>

            <Link 
              className="button"
              to="/delivery-returns"
            >
              Delivery info
            </Link>
          </div>
        </div>
      </section>

      <WhatsAppButton />
    </>
  );
}