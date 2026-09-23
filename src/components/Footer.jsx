import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div>
          <Link className="footer-brand" to="/">
            Honey <span>&</span> Home Co
          </Link>

          <p>
            Beautiful, practical finds that make
            home feel special.
          </p>
        </div>

        <div>
          <h4>Shop</h4>

          <Link to="/shop">All products</Link>
          <Link to="/delivery-returns">
            Delivery & Returns
          </Link>
          <Link to="/faq">FAQ</Link>
        </div>

        <div>
          <h4>About</h4>

          <Link to="/about">Our story</Link>
          <Link to="/contact">Contact us</Link>
          <Link to="/privacy">Privacy Policy</Link>
          <Link to="/terms">
            Terms & Conditions
          </Link>
        </div>

        <div>
          <h4>Contact</h4>

          <a href="mailto:honeyandco@gmail.com">
            honeyandco@gmail.com
          </a>

          <a
            href="https://wa.me/27786874957"
            target="_blank"
            rel="noreferrer"
          >
            078 687 4957
          </a>

          <p>Delivery within South Africa 🇿🇦</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>
          © {new Date().getFullYear()} Honey & Home Co.
          All rights reserved.
        </p>
      </div>
    </footer>
  );
}