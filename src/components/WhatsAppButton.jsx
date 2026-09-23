import { MessageCircle } from 'lucide-react';

export default function WhatsAppButton() {
  const number =
    import.meta.env.VITE_WHATSAPP_NUMBER || '27786874957';

  return (
    <a
      className="floating-wa"
      href={`https://wa.me/${number}`}
      target="_blank"
      rel="noreferrer"
      aria-label="WhatsApp"
    >
      <MessageCircle />
    </a>
  );
}