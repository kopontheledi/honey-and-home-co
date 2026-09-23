import { Heart, Home, Sparkles } from 'lucide-react';

export default function About() {
  return (
    <section className="section info-page">
      <p className="eyebrow">OUR STORY</p>
      <h1>About Honey & Home Co</h1>

      <div className="info-intro">
        <p>
          Honey & Home Co is all about the little things
          that make a house feel like home.
        </p>

        <p>
          We offer beautiful, practical and affordable
          home finds for everyday living — from kitchen
          and tableware to décor and household favourites.
        </p>
      </div>

      <div className="about-values">
        <div>
          <Home />
          <h3>Made for home</h3>
          <p>
            Useful pieces chosen with everyday homes and
            everyday living in mind.
          </p>
        </div>

        <div>
          <Heart />
          <h3>Chosen with care</h3>
          <p>
            We aim to bring you products that are both
            practical and beautiful.
          </p>
        </div>

        <div>
          <Sparkles />
          <h3>Simple shopping</h3>
          <p>
            Browse online, order through our website or
            enquire with us directly on WhatsApp.
          </p>
        </div>
      </div>
    </section>
  );
}