import { Shirt, Layers, Tag } from 'lucide-react';

/**
 * Fallback icon for clothing items that have no image.
 * jacket → Layers, top → Shirt, everything else → Tag
 */
export function ClothingIcon({ category, size = 32, className = '' }) {
  const props = { size, className };
  if (category === 'jacket') return <Layers {...props} />;
  if (category === 'top' || category === 'shirt') return <Shirt {...props} />;
  return <Tag {...props} />;
}
