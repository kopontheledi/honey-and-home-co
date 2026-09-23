const number =
  import.meta.env.VITE_WHATSAPP_NUMBER || '27786874957';

export function productWhatsApp(product) {
  const url = `${window.location.origin}/product/${product.id}`;

  const message = `Hi Honey & Home Co 👋

I'm interested in:
${product.name}
Price: R${Number(product.price).toFixed(2)}

${url}`;

  return `https://wa.me/${number}?text=${encodeURIComponent(
    message
  )}`;
}

export function cartWhatsApp(items) {
  const lines = items
    .map(
      (item) =>
        `• ${item.name} x${item.qty} — R${(
          item.price * item.qty
        ).toFixed(2)}`
    )
    .join('\n');

  const message = `Hi Honey & Home Co 👋

I'd like to order:
${lines}

Please confirm delivery/collection and total.`;

  return `https://wa.me/${number}?text=${encodeURIComponent(
    message
  )}`;
}