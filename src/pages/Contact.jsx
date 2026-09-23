import {
  Mail,
  MessageCircle,
  MapPin,
} from 'lucide-react';

export default function Contact() {
  const whatsapp =
    import.meta.env.VITE_WHATSAPP_NUMBER ||
    '27786874957';

  return (
    <section className="section info-page">
      <p className="eyebrow">GET IN TOUCH</p>
      <h1>Contact us</h1>

      <p className="info-lead">
        Have a question about a product or an order?
        We'd love to hear from you.
      </p>

      <div className="contact-grid">
        <a
          href={`https://wa.me/${whatsapp}`}
          target="_blank"
          rel="noreferrer"
        >
          <MessageCircle />

          <div>
            <h3>WhatsApp</h3>
            <p>078 687 4957</p>
          </div>
        </a>

        <a href="mailto:honeyandco@gmail.com">
          <Mail />

          <div>
            <h3>Email</h3>
            <p>honeyandco@gmail.com</p>
          </div>
        </a>

        <div>
          <MapPin />

          <div>
            <h3>Delivery</h3>
            <p>South Africa only</p>
          </div>
        </div>
      </div>
    </section>
  );
}