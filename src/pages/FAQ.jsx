const questions = [
  {
    question: 'Where do you deliver?',
    answer:
      'We currently deliver within South Africa only.',
  },
  {
    question: 'How much is delivery?',
    answer:
      'Website orders have a standard R150 delivery fee.',
  },
  {
    question: 'How can I place an order?',
    answer:
      'You can add products to your cart and checkout through the website. You can also contact us on WhatsApp for product enquiries.',
  },
  {
    question: 'What if a product is out of stock?',
    answer:
      'Products marked as out of stock cannot be added to your cart. You can contact us on WhatsApp if you would like to ask about future availability.',
  },
  {
    question: 'Can I change my order?',
    answer:
      'Please contact us as soon as possible. If your order has not yet been processed or dispatched, we will let you know whether a change is possible.',
  },
  {
    question: 'How do I contact Honey & Home Co?',
    answer:
      'You can WhatsApp us on 078 687 4957 or email honeyandco@gmail.com.',
  },
];

export default function FAQ() {
  return (
    <section className="section info-page">
      <p className="eyebrow">NEED SOME HELP?</p>
      <h1>Frequently asked questions</h1>

      <div className="faq-list">
        {questions.map((item) => (
          <details key={item.question}>
            <summary>{item.question}</summary>
            <p>{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}