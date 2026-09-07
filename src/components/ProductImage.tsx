import type { Product } from "../types";

interface Props {
  product: Product;
  className?: string;
  imageClassName?: string;
  alt?: string;
  src?: string;
}

const CATEGORY_MARKS: Record<string, string> = {
  Smartphones: "📱",
  Laptops: "💻",
  Tablets: "📲",
  Audio: "🎧",
  Wearables: "⌚",
  "Travel & Flights": "✈️",
  Hotels: "🏨",
  "Jewelry & Beauty": "💎",
  "Furniture & Home": "🛋️",
  Cameras: "📷",
  Appliances: "🏠",
  Gaming: "🎮",
  Fitness: "🏃",
};

export default function ProductImage({ product, className = "", imageClassName = "", alt, src }: Props) {
  const imageSrc = src ?? product.images[0];
  const fallback = `https://picsum.photos/seed/${encodeURIComponent(`1fi-${product.id}-${imageSrc}`)}/600/600`;
  const mark = CATEGORY_MARKS[product.category] ?? "🛍️";

  return (
    <div className={`relative overflow-hidden bg-[#EDE5FD] ${className}`}>
      <div className="absolute inset-0 flex items-center justify-center text-5xl" aria-hidden="true">
        {mark}
      </div>
      <img
        src={imageSrc}
        alt={alt ?? product.name}
        className={`relative w-full h-full ${imageClassName}`}
        onError={(event) => {
          const image = event.currentTarget;
          image.onerror = null;
          image.src = fallback;
        }}
      />
    </div>
  );
}