import { useState } from 'react';

export default function ProductGallery({ images = [], name }) {
  const pics = images.length
    ? images
    : ['https://placehold.co/800x700?text=Honey+%26+Home'];

  const [active, setActive] = useState(pics[0]);

  return (
    <div className="gallery">
      <img
        className="gallery-main"
        src={active}
        alt={name}
      />

      <div className="thumbs">
        {pics.map((src, index) => (
          <button
            key={src + index}
            onClick={() => setActive(src)}
          >
            <img
              src={src}
              alt={`${name} ${index + 1}`}
            />
          </button>
        ))}
      </div>
    </div>
  );
}