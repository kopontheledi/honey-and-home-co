import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Heart,
  Truck,
  MessageCircle,
} from 'lucide-react';

import WhatsAppButton from '../components/WhatsAppButton';

export default function Home() {
  const categories = [
    'Bowls',
    'Cups',
    'Standing Mirrors',
    'Noodle Boxes',
    'Plates',
    'Pots',
    'Glasses',
  ];

  return (
    <>
      <section className="hero">
        <div>
          <p className="eyebrow">
            WELCOME HOME
          </p>

          <h1>
            Little things that make home feel{' '}
            <em>special.</em>
          </h1>

          <p>
            Shop practical, beautiful finds for your
            kitchen, table and home — from bowls and
            cups to mirrors, pots and pantry favourites.
          </p>

          <Link
            className="button"
            to="/shop"
          >
            Shop collection
            <ArrowRight size={18} />
          </Link>
        </div>

        <div className="hero-art">
          Honey
          <br />
          <span>& Home</span>
        </div>
      </section>

      <section className="benefits">
        <div>
          <Heart />
          Carefully selected
        </div>

        <div>
          <Truck />
          Delivery available
        </div>

        <div>
          <MessageCircle />
          Easy WhatsApp enquiries
        </div>
      </section>

      <section className="section">
        <p className="eyebrow">
          OUR COLLECTION
        </p>

        <h2>Made for everyday living</h2>

        <div className="category-grid">
          {categories.map((category) => (
            <Link
              to={`/shop?category=${encodeURIComponent(
                category
              )}`}
              key={category}
            >
              {category}

              <span>Explore →</span>
            </Link>
          ))}
        </div>
      </section>

      <WhatsAppButton />
    </>
  );
}