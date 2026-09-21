'use client';

import React from 'react';
import { ProductIllustrationName } from '@/types';

export interface IllustrationProps {
  name: ProductIllustrationName;
  className?: string;
  color?: string;
  fillColor?: string;
  style?: React.CSSProperties;
}

/**
 * Detects whether a hex color is light (e.g. white, bone-white, cream, ivory).
 * Used to avoid low-contrast blending on light store backgrounds.
 */
export function isLightColor(hex?: string): boolean {
  if (!hex) return false;
  const clean = hex.replace('#', '').trim();
  if (clean.length !== 3 && clean.length !== 6) return false;
  const r = parseInt(clean.length === 3 ? clean[0] + clean[0] : clean.substring(0, 2), 16);
  const g = parseInt(clean.length === 3 ? clean[1] + clean[1] : clean.substring(2, 4), 16);
  const b = parseInt(clean.length === 3 ? clean[2] + clean[2] : clean.substring(4, 6), 16);
  if (isNaN(r) || isNaN(g) || isNaN(b)) return false;
  // Perceived relative luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.72;
}

export interface IllustrationCategoryItem {
  id: ProductIllustrationName;
  name: string;
  category: 'apparel' | 'carry' | 'tech' | 'ceramics' | 'home';
  categoryLabel: string;
}

export const ALL_ILLUSTRATION_ITEMS: IllustrationCategoryItem[] = [
  // 1. Apparel & Wearables (25)
  { id: 'tshirt', name: 'T-Shirt', category: 'apparel', categoryLabel: 'Apparel & Wear' },
  { id: 'hoodie', name: 'Hoodie', category: 'apparel', categoryLabel: 'Apparel & Wear' },
  { id: 'jacket', name: 'Chore Jacket', category: 'apparel', categoryLabel: 'Apparel & Wear' },
  { id: 'sweater', name: 'Crewneck Sweater', category: 'apparel', categoryLabel: 'Apparel & Wear' },
  { id: 'coat', name: 'Overcoat', category: 'apparel', categoryLabel: 'Apparel & Wear' },
  { id: 'pants', name: 'Linen Trousers', category: 'apparel', categoryLabel: 'Apparel & Wear' },
  { id: 'shorts', name: 'Lounge Shorts', category: 'apparel', categoryLabel: 'Apparel & Wear' },
  { id: 'dress', name: 'Shift Dress', category: 'apparel', categoryLabel: 'Apparel & Wear' },
  { id: 'kimono', name: 'Haori Robe', category: 'apparel', categoryLabel: 'Apparel & Wear' },
  { id: 'vest', name: 'Quilted Vest', category: 'apparel', categoryLabel: 'Apparel & Wear' },
  { id: 'hat', name: 'Brimmed Hat', category: 'apparel', categoryLabel: 'Apparel & Wear' },
  { id: 'cap', name: 'Cotton Cap', category: 'apparel', categoryLabel: 'Apparel & Wear' },
  { id: 'beanie', name: 'Merino Beanie', category: 'apparel', categoryLabel: 'Apparel & Wear' },
  { id: 'scarf', name: 'Linen Scarf', category: 'apparel', categoryLabel: 'Apparel & Wear' },
  { id: 'socks', name: 'Crew Socks', category: 'apparel', categoryLabel: 'Apparel & Wear' },
  { id: 'blazer', name: 'Tailored Blazer', category: 'apparel', categoryLabel: 'Apparel & Wear' },
  { id: 'cardigan', name: 'Knit Cardigan', category: 'apparel', categoryLabel: 'Apparel & Wear' },
  { id: 'turtleneck', name: 'Rollneck Sweater', category: 'apparel', categoryLabel: 'Apparel & Wear' },
  { id: 'tanktop', name: 'Ribbed Tank Top', category: 'apparel', categoryLabel: 'Apparel & Wear' },
  { id: 'skirt', name: 'Pleated Skirt', category: 'apparel', categoryLabel: 'Apparel & Wear' },
  { id: 'overalls', name: 'Workwear Overalls', category: 'apparel', categoryLabel: 'Apparel & Wear' },
  { id: 'gloves', name: 'Knit Mittens', category: 'apparel', categoryLabel: 'Apparel & Wear' },
  { id: 'apron', name: 'Artisan Apron', category: 'apparel', categoryLabel: 'Apparel & Wear' },
  { id: 'belt-buckle', name: 'Leather Belt Clasp', category: 'apparel', categoryLabel: 'Apparel & Wear' },
  { id: 'raincoat', name: 'Storm Parka', category: 'apparel', categoryLabel: 'Apparel & Wear' },

  // 2. Footwear & Carry (20)
  { id: 'sneakers', name: 'Court Sneakers', category: 'carry', categoryLabel: 'Footwear & Bags' },
  { id: 'boots', name: 'Chelsea Boots', category: 'carry', categoryLabel: 'Footwear & Bags' },
  { id: 'sandals', name: 'Slide Sandals', category: 'carry', categoryLabel: 'Footwear & Bags' },
  { id: 'loafers', name: 'Penny Loafers', category: 'carry', categoryLabel: 'Footwear & Bags' },
  { id: 'slippers', name: 'Felt Slippers', category: 'carry', categoryLabel: 'Footwear & Bags' },
  { id: 'backpack', name: 'Roll-Top Daypack', category: 'carry', categoryLabel: 'Footwear & Bags' },
  { id: 'totebag', name: 'Market Tote', category: 'carry', categoryLabel: 'Footwear & Bags' },
  { id: 'duffle', name: 'Travel Duffle', category: 'carry', categoryLabel: 'Footwear & Bags' },
  { id: 'wallet', name: 'Bi-Fold Wallet', category: 'carry', categoryLabel: 'Footwear & Bags' },
  { id: 'pouch', name: 'Zip Pouch', category: 'carry', categoryLabel: 'Footwear & Bags' },
  { id: 'belt', name: 'Leather Belt', category: 'carry', categoryLabel: 'Footwear & Bags' },
  { id: 'umbrella', name: 'Wood Umbrella', category: 'carry', categoryLabel: 'Footwear & Bags' },
  { id: 'clogs', name: 'Mule Clogs', category: 'carry', categoryLabel: 'Footwear & Bags' },
  { id: 'derby', name: 'Derby Shoes', category: 'carry', categoryLabel: 'Footwear & Bags' },
  { id: 'chelsea-boot', name: 'Ankle Boot', category: 'carry', categoryLabel: 'Footwear & Bags' },
  { id: 'messenger-bag', name: 'Messenger Bag', category: 'carry', categoryLabel: 'Footwear & Bags' },
  { id: 'clutch', name: 'Envelope Clutch', category: 'carry', categoryLabel: 'Footwear & Bags' },
  { id: 'fanny-pack', name: 'Sling Pack', category: 'carry', categoryLabel: 'Footwear & Bags' },
  { id: 'luggage', name: 'Travel Suitcase', category: 'carry', categoryLabel: 'Footwear & Bags' },
  { id: 'cardholder', name: 'Card Sleeve', category: 'carry', categoryLabel: 'Footwear & Bags' },

  // 3. Ceramics, Kitchen & Dining (25)
  { id: 'mug', name: 'Ceramic Mug', category: 'ceramics', categoryLabel: 'Ceramics & Table' },
  { id: 'cup', name: 'Tea Tumbler', category: 'ceramics', categoryLabel: 'Ceramics & Table' },
  { id: 'teapot', name: 'Kyusu Teapot', category: 'ceramics', categoryLabel: 'Ceramics & Table' },
  { id: 'kettle', name: 'Gooseneck Kettle', category: 'ceramics', categoryLabel: 'Ceramics & Table' },
  { id: 'vase', name: 'Kaolin Vase', category: 'ceramics', categoryLabel: 'Ceramics & Table' },
  { id: 'bowl', name: 'Stoneware Bowl', category: 'ceramics', categoryLabel: 'Ceramics & Table' },
  { id: 'plate', name: 'Ceramic Plate', category: 'ceramics', categoryLabel: 'Ceramics & Table' },
  { id: 'pitcher', name: 'Water Pitcher', category: 'ceramics', categoryLabel: 'Ceramics & Table' },
  { id: 'bottle', name: 'Stainless Bottle', category: 'ceramics', categoryLabel: 'Ceramics & Table' },
  { id: 'coffee-press', name: 'French Press', category: 'ceramics', categoryLabel: 'Ceramics & Table' },
  { id: 'cutlery', name: 'Table Cutlery', category: 'ceramics', categoryLabel: 'Ceramics & Table' },
  { id: 'tray', name: 'Walnut Tray', category: 'ceramics', categoryLabel: 'Ceramics & Table' },
  { id: 'matcha-whisk', name: 'Chasen Whisk', category: 'ceramics', categoryLabel: 'Ceramics & Table' },
  { id: 'matcha-bowl', name: 'Chawan Bowl', category: 'ceramics', categoryLabel: 'Ceramics & Table' },
  { id: 'pour-over', name: 'Pour-Over Brewer', category: 'ceramics', categoryLabel: 'Ceramics & Table' },
  { id: 'mortar-pestle', name: 'Mortar & Pestle', category: 'ceramics', categoryLabel: 'Ceramics & Table' },
  { id: 'chopsticks', name: 'Chopsticks & Rest', category: 'ceramics', categoryLabel: 'Ceramics & Table' },
  { id: 'serving-board', name: 'Serving Board', category: 'ceramics', categoryLabel: 'Ceramics & Table' },
  { id: 'carafe', name: 'Glass Carafe', category: 'ceramics', categoryLabel: 'Ceramics & Table' },
  { id: 'salt-pepper', name: 'Seasoning Shakers', category: 'ceramics', categoryLabel: 'Ceramics & Table' },
  { id: 'wine-goblet', name: 'Stemmed Goblet', category: 'ceramics', categoryLabel: 'Ceramics & Table' },
  { id: 'espresso-cup', name: 'Demitasse Cup', category: 'ceramics', categoryLabel: 'Ceramics & Table' },
  { id: 'sauce-dish', name: 'Condiment Dish', category: 'ceramics', categoryLabel: 'Ceramics & Table' },
  { id: 'jar', name: 'Cork Storage Jar', category: 'ceramics', categoryLabel: 'Ceramics & Table' },
  { id: 'cooking-pot', name: 'Donabe Pot', category: 'ceramics', categoryLabel: 'Ceramics & Table' },

  // 4. Home Living & Studio (25)
  { id: 'plant', name: 'Potted Plant', category: 'home', categoryLabel: 'Home & Living' },
  { id: 'flower', name: 'Botanical Stem', category: 'home', categoryLabel: 'Home & Living' },
  { id: 'lamp', name: 'Studio Desk Lamp', category: 'home', categoryLabel: 'Home & Living' },
  { id: 'lantern', name: 'Washi Lantern', category: 'home', categoryLabel: 'Home & Living' },
  { id: 'candle', name: 'Pillar Candle', category: 'home', categoryLabel: 'Home & Living' },
  { id: 'cushion', name: 'Floor Cushion', category: 'home', categoryLabel: 'Home & Living' },
  { id: 'blanket', name: 'Wool Blanket', category: 'home', categoryLabel: 'Home & Living' },
  { id: 'chair', name: 'Wood Armchair', category: 'home', categoryLabel: 'Home & Living' },
  { id: 'stool', name: 'Three-Leg Stool', category: 'home', categoryLabel: 'Home & Living' },
  { id: 'mirror', name: 'Arched Mirror', category: 'home', categoryLabel: 'Home & Living' },
  { id: 'clock', name: 'Wall Clock', category: 'home', categoryLabel: 'Home & Living' },
  { id: 'basket', name: 'Rattan Basket', category: 'home', categoryLabel: 'Home & Living' },
  { id: 'notebook', name: 'Linen Journal', category: 'home', categoryLabel: 'Home & Living' },
  { id: 'diffuser', name: 'Reed Diffuser', category: 'home', categoryLabel: 'Home & Living' },
  { id: 'towel', name: 'Waffle Towel', category: 'home', categoryLabel: 'Home & Living' },
  { id: 'bonsai', name: 'Zen Bonsai Tree', category: 'home', categoryLabel: 'Home & Living' },
  { id: 'desk', name: 'Timber Writing Desk', category: 'home', categoryLabel: 'Home & Living' },
  { id: 'shelf', name: 'Floating Wall Shelf', category: 'home', categoryLabel: 'Home & Living' },
  { id: 'bench', name: 'Slatted Entry Bench', category: 'home', categoryLabel: 'Home & Living' },
  { id: 'rug', name: 'Woven Floor Rug', category: 'home', categoryLabel: 'Home & Living' },
  { id: 'floor-lamp', name: 'Arc Floor Lamp', category: 'home', categoryLabel: 'Home & Living' },
  { id: 'incense', name: 'Incense Burner', category: 'home', categoryLabel: 'Home & Living' },
  { id: 'watering-can', name: 'Watering Can', category: 'home', categoryLabel: 'Home & Living' },
  { id: 'curtain', name: 'Linen Drapes', category: 'home', categoryLabel: 'Home & Living' },
  { id: 'coat-rack', name: 'Timber Coat Tree', category: 'home', categoryLabel: 'Home & Living' },

  // 5. Tech, Sound, Wellness & Personal (20)
  { id: 'headphones', name: 'Headphones', category: 'tech', categoryLabel: 'Tech & Personal' },
  { id: 'earbuds', name: 'Wireless Earbuds', category: 'tech', categoryLabel: 'Tech & Personal' },
  { id: 'watch', name: 'Minimalist Watch', category: 'tech', categoryLabel: 'Tech & Personal' },
  { id: 'sunglasses', name: 'Sunglasses', category: 'tech', categoryLabel: 'Tech & Personal' },
  { id: 'glasses', name: 'Wireframe Glasses', category: 'tech', categoryLabel: 'Tech & Personal' },
  { id: 'pen', name: 'Brass Pen', category: 'tech', categoryLabel: 'Tech & Personal' },
  { id: 'laptop', name: 'Slim Laptop', category: 'tech', categoryLabel: 'Tech & Personal' },
  { id: 'camera', name: 'Rangefinder Camera', category: 'tech', categoryLabel: 'Tech & Personal' },
  { id: 'speaker', name: 'Mesh Audio Speaker', category: 'tech', categoryLabel: 'Tech & Personal' },
  { id: 'phone', name: 'Smartphone', category: 'tech', categoryLabel: 'Tech & Personal' },
  { id: 'turntable', name: 'Vinyl Turntable', category: 'tech', categoryLabel: 'Tech & Personal' },
  { id: 'radio', name: 'Tabletop Radio', category: 'tech', categoryLabel: 'Tech & Personal' },
  { id: 'soap', name: 'Artisan Soap Bar', category: 'tech', categoryLabel: 'Tech & Personal' },
  { id: 'perfume', name: 'Fragrance Flacon', category: 'tech', categoryLabel: 'Tech & Personal' },
  { id: 'comb', name: 'Grooming Comb', category: 'tech', categoryLabel: 'Tech & Personal' },
  { id: 'scissor', name: 'Craft Shears', category: 'tech', categoryLabel: 'Tech & Personal' },
  { id: 'keychain', name: 'Studio Keychain', category: 'tech', categoryLabel: 'Tech & Personal' },
  { id: 'pocket-knife', name: 'Folding Knife', category: 'tech', categoryLabel: 'Tech & Personal' },
  { id: 'journal-pen', name: 'Sketchbook & Pen', category: 'tech', categoryLabel: 'Tech & Personal' },
  { id: 'magnifier', name: 'Magnifying Glass', category: 'tech', categoryLabel: 'Tech & Personal' },
];

export const ProductIllustration: React.FC<IllustrationProps> = ({
  name,
  className = 'w-28 h-28 stroke-[1.6]',
  color,
  fillColor,
  style,
}) => {
  const isLight = isLightColor(color);

  // When a product color is white or near-white (e.g. Bone White #fcf9f8, Pure White #ffffff),
  // drawing a white stroke on a light background causes it to wash out and blend completely.
  // For light colors, we provide a crisp slate navy stroke (#25435a), an opaque white body fill (#ffffff),
  // and a subtle ambient drop-shadow so the white item is vividly defined and pops out with depth.
  const strokeColor = isLight ? '#25435a' : (color || '#25435a');
  const computedFill = fillColor || (isLight ? (color || '#ffffff') : (color ? `${color}18` : 'none'));

  const svgStyle: React.CSSProperties = {
    stroke: strokeColor,
    fill: computedFill,
    filter: isLight ? 'drop-shadow(0 6px 14px rgba(37, 67, 90, 0.16))' : undefined,
    transition: 'stroke 0.35s ease, fill 0.35s ease, filter 0.35s ease',
    ...style,
  };

  const renderSvg = () => {
    switch (name) {
      // =========================================================================
      // 1. APPAREL & WEARABLES (15)
      // =========================================================================
      case 'tshirt':
        return (
          <>
            <path
              d="M 32 20 L 42 26 C 45 28 55 28 58 26 L 68 20 L 84 32 L 74 44 L 68 40 L 68 82 L 32 82 L 32 40 L 26 44 L 16 32 Z"
              strokeLinejoin="round"
            />
            <path d="M 42 26 C 46 31 54 31 58 26" strokeLinecap="round" fill="none" />
          </>
        );

      case 'hoodie':
        return (
          <>
            <path
              d="M 30 26 L 36 14 C 44 12 56 12 64 14 L 70 26 L 86 36 L 76 48 L 70 44 L 70 82 L 30 82 L 30 44 L 24 48 L 14 36 Z"
              strokeLinejoin="round"
            />
            <path d="M 38 24 C 44 28 56 28 62 24" strokeLinecap="round" fill="none" />
            <path d="M 46 26 L 46 38" strokeLinecap="round" fill="none" />
            <path d="M 54 26 L 54 38" strokeLinecap="round" fill="none" />
            <path d="M 38 56 L 62 56 L 60 74 L 40 74 Z" strokeLinejoin="round" />
          </>
        );

      case 'jacket':
        return (
          <>
            <path
              d="M 34 22 L 44 26 L 56 26 L 66 22 L 82 32 L 74 44 L 68 40 L 68 82 L 32 82 L 32 40 L 26 44 L 18 32 Z"
              strokeLinejoin="round"
            />
            <line x1="50" x2="50" y1="26" y2="82" strokeLinecap="round" fill="none" />
            <path d="M 34 22 L 44 34 L 50 26 L 56 34 L 66 22" strokeLinejoin="round" fill="none" />
            <rect x="36" y="58" width="10" height="14" rx="2" strokeLinejoin="round" />
            <rect x="54" y="58" width="10" height="14" rx="2" strokeLinejoin="round" />
            <circle cx="47" cy="40" r="1.5" />
            <circle cx="47" cy="50" r="1.5" />
          </>
        );

      case 'sweater':
        return (
          <>
            <path
              d="M 32 24 L 42 28 C 46 30 54 30 58 28 L 68 24 L 84 36 L 76 46 L 70 42 L 70 80 L 30 80 L 30 42 L 24 46 L 16 36 Z"
              strokeLinejoin="round"
            />
            <path d="M 42 28 C 45 32 55 32 58 28" strokeLinecap="round" fill="none" />
            <line x1="44" x2="44" y1="36" y2="76" strokeDasharray="3 3" fill="none" />
            <line x1="56" x2="56" y1="36" y2="76" strokeDasharray="3 3" fill="none" />
            <line x1="30" x2="70" y1="76" y2="76" strokeLinecap="round" fill="none" />
          </>
        );

      case 'coat':
        return (
          <>
            <path
              d="M 34 18 L 44 24 L 56 24 L 66 18 L 80 30 L 72 40 L 68 36 L 72 88 L 28 88 L 32 36 L 28 40 L 20 30 Z"
              strokeLinejoin="round"
            />
            <path d="M 34 18 L 46 38 L 52 24 L 58 38 L 66 18" strokeLinejoin="round" fill="none" />
            <line x1="50" x2="50" y1="38" y2="88" strokeLinecap="round" fill="none" />
            <line x1="30" x2="70" y1="58" y2="58" strokeLinecap="round" strokeDasharray="4 3" fill="none" />
          </>
        );

      case 'pants':
        return (
          <>
            <path
              d="M 34 20 L 66 20 L 68 84 L 53 84 L 50 48 L 47 84 L 32 84 Z"
              strokeLinejoin="round"
            />
            <line x1="34" x2="66" y1="26" y2="26" strokeLinecap="round" fill="none" />
            <line x1="50" x2="50" y1="26" y2="40" strokeLinecap="round" fill="none" />
            <line x1="32" x2="47" y1="80" y2="80" fill="none" />
            <line x1="53" x2="68" y1="80" y2="80" fill="none" />
          </>
        );

      case 'shorts':
        return (
          <>
            <path
              d="M 32 24 L 68 24 L 70 64 L 54 64 L 50 44 L 46 64 L 30 64 Z"
              strokeLinejoin="round"
            />
            <line x1="32" x2="68" y1="30" y2="30" strokeLinecap="round" fill="none" />
            <path d="M 48 30 L 46 36 M 52 30 L 54 36" strokeLinecap="round" fill="none" />
          </>
        );

      case 'dress':
        return (
          <>
            <path
              d="M 38 20 L 44 24 C 48 26 52 26 56 24 L 62 20 L 68 34 L 62 38 L 60 48 L 74 84 L 26 84 L 40 48 L 38 38 L 32 34 Z"
              strokeLinejoin="round"
            />
            <line x1="38" x2="62" y1="48" y2="48" strokeLinecap="round" fill="none" />
          </>
        );

      case 'kimono':
        return (
          <>
            <path
              d="M 30 20 L 40 24 L 60 24 L 70 20 L 86 36 L 76 56 L 68 50 L 68 84 L 32 84 L 32 50 L 24 56 L 14 36 Z"
              strokeLinejoin="round"
            />
            <path d="M 40 24 L 58 56 L 68 84" strokeLinecap="round" fill="none" />
            <rect x="32" y="52" width="36" height="10" rx="1" strokeLinejoin="round" />
          </>
        );

      case 'vest':
        return (
          <>
            <path
              d="M 36 22 L 44 26 L 56 26 L 64 22 L 72 38 L 66 42 L 66 82 L 34 82 L 34 42 L 28 38 Z"
              strokeLinejoin="round"
            />
            <line x1="50" x2="50" y1="26" y2="82" strokeLinecap="round" fill="none" />
            <line x1="34" x2="66" y1="42" y2="42" strokeDasharray="3 3" fill="none" />
            <line x1="34" x2="66" y1="56" y2="56" strokeDasharray="3 3" fill="none" />
            <line x1="34" x2="66" y1="70" y2="70" strokeDasharray="3 3" fill="none" />
          </>
        );

      case 'hat':
        return (
          <>
            <ellipse cx="50" cy="62" rx="36" ry="14" strokeLinejoin="round" />
            <path d="M 34 58 C 34 32 40 26 50 26 C 60 26 66 32 66 58" strokeLinejoin="round" />
            <path d="M 34 54 C 42 58 58 58 66 54" strokeLinecap="round" fill="none" />
          </>
        );

      case 'cap':
        return (
          <>
            <path d="M 28 54 C 28 34 72 34 72 54 Z" strokeLinejoin="round" />
            <path d="M 70 52 C 78 52 86 56 88 60 C 82 62 70 60 66 56" strokeLinejoin="round" />
            <circle cx="50" cy="34" r="2" />
            <line x1="50" x2="50" y1="34" y2="54" strokeLinecap="round" fill="none" />
          </>
        );

      case 'beanie':
        return (
          <>
            <path d="M 30 58 C 30 30 40 22 50 22 C 60 22 70 30 70 58 Z" strokeLinejoin="round" />
            <rect x="26" y="58" width="48" height="16" rx="3" strokeLinejoin="round" />
            <circle cx="50" cy="18" r="4" strokeLinejoin="round" />
          </>
        );

      case 'scarf':
        return (
          <>
            <ellipse cx="50" cy="36" rx="20" ry="12" strokeLinejoin="round" />
            <path d="M 44 46 L 40 76 L 48 76 L 50 46" strokeLinejoin="round" />
            <path d="M 52 46 L 54 82 L 62 82 L 58 46" strokeLinejoin="round" />
            <line x1="40" x2="48" y1="73" y2="73" strokeDasharray="1 2" fill="none" />
            <line x1="54" x2="62" y1="79" y2="79" strokeDasharray="1 2" fill="none" />
          </>
        );

      case 'socks':
        return (
          <>
            <path
              d="M 34 24 L 52 24 L 52 56 L 68 66 C 72 70 70 76 64 78 C 58 80 50 78 44 72 L 34 58 Z"
              strokeLinejoin="round"
            />
            <line x1="34" x2="52" y1="30" y2="30" strokeDasharray="2 2" fill="none" />
          </>
        );

      // =========================================================================
      // 2. FOOTWEAR & CARRY (12)
      // =========================================================================
      case 'sneakers':
        return (
          <>
            <ellipse cx="40" cy="50" rx="9" ry="24" transform="rotate(-6 40 50)" />
            <ellipse cx="40" cy="62" rx="5" ry="8" transform="rotate(-6 40 62)" />
            <line x1="36" x2="44" y1="42" y2="42" fill="none" />
            <line x1="36" x2="44" y1="46" y2="46" fill="none" />
            <line x1="37" x2="43" y1="50" y2="50" fill="none" />
            <ellipse cx="60" cy="50" rx="9" ry="24" transform="rotate(6 60 50)" />
            <ellipse cx="60" cy="62" rx="5" ry="8" transform="rotate(6 60 62)" />
            <line x1="56" x2="64" y1="42" y2="42" fill="none" />
            <line x1="56" x2="64" y1="46" y2="46" fill="none" />
            <line x1="57" x2="63" y1="50" y2="50" fill="none" />
          </>
        );

      case 'boots':
        return (
          <>
            <path
              d="M 32 30 L 52 30 L 52 54 L 74 64 C 78 68 76 76 70 78 L 28 78 C 24 74 24 64 28 60 L 32 54 Z"
              strokeLinejoin="round"
            />
            <path d="M 40 30 L 38 46 L 46 46 L 44 30" strokeLinecap="round" fill="none" />
            <line x1="26" x2="76" y1="74" y2="74" strokeLinecap="round" fill="none" />
          </>
        );

      case 'sandals':
        return (
          <>
            <ellipse cx="50" cy="52" rx="20" ry="32" strokeLinejoin="round" />
            <path d="M 32 40 C 44 38 56 38 68 40" strokeLinecap="round" strokeWidth="3" fill="none" />
            <path d="M 34 58 C 44 56 56 56 66 58" strokeLinecap="round" strokeWidth="3" fill="none" />
          </>
        );

      case 'loafers':
        return (
          <>
            <path
              d="M 22 56 C 26 44 60 40 76 52 C 82 58 82 68 76 72 L 24 72 C 18 68 18 60 22 56 Z"
              strokeLinejoin="round"
            />
            <rect x="42" y="44" width="16" height="8" rx="2" strokeLinejoin="round" />
            <line x1="20" x2="80" y1="68" y2="68" strokeLinecap="round" fill="none" />
          </>
        );

      case 'slippers':
        return (
          <>
            <path
              d="M 24 58 C 28 42 54 40 74 48 C 80 54 80 66 74 70 L 26 70 C 20 66 20 62 24 58 Z"
              strokeLinejoin="round"
            />
            <ellipse cx="48" cy="54" rx="22" ry="12" strokeLinecap="round" fill="none" />
          </>
        );

      case 'backpack':
        return (
          <>
            <rect height="46" rx="6" strokeLinejoin="round" width="36" x="32" y="32" />
            <path d="M 43 32 L 43 24 L 57 24 L 57 32" strokeLinecap="round" fill="none" />
            <rect height="22" rx="2" strokeLinejoin="round" width="24" x="38" y="50" />
            <line strokeLinecap="round" x1="32" x2="68" y1="42" y2="42" fill="none" />
            <polygon points="50,56 46,62 54,62" />
          </>
        );

      case 'totebag':
        return (
          <>
            <path d="M 40 46 L 40 22 C 40 18 60 18 60 22 L 60 46" strokeLinecap="round" fill="none" />
            <rect height="38" rx="2" strokeLinejoin="round" width="40" x="30" y="44" />
            <line strokeLinecap="round" x1="30" x2="70" y1="52" y2="52" fill="none" />
          </>
        );

      case 'duffle':
        return (
          <>
            <rect x="22" y="42" width="56" height="30" rx="12" strokeLinejoin="round" />
            <path d="M 38 42 L 38 28 C 38 24 62 24 62 28 L 62 42" strokeLinecap="round" fill="none" />
            <line x1="22" x2="78" y1="52" y2="52" strokeLinecap="round" fill="none" />
            <line x1="34" x2="34" y1="42" y2="72" strokeDasharray="3 3" fill="none" />
            <line x1="66" x2="66" y1="42" y2="72" strokeDasharray="3 3" fill="none" />
          </>
        );

      case 'wallet':
        return (
          <>
            <rect x="26" y="34" width="48" height="34" rx="4" strokeLinejoin="round" />
            <path d="M 26 44 L 74 44" strokeLinecap="round" fill="none" />
            <rect x="56" y="46" width="18" height="12" rx="2" strokeLinejoin="round" />
            <circle cx="62" cy="52" r="1.5" />
          </>
        );

      case 'pouch':
        return (
          <>
            <rect x="26" y="38" width="48" height="30" rx="4" strokeLinejoin="round" />
            <line x1="26" x2="74" y1="44" y2="44" strokeLinecap="round" fill="none" />
            <circle cx="70" cy="44" r="2" />
            <line x1="72" x2="78" y1="44" y2="44" strokeLinecap="round" fill="none" />
          </>
        );

      case 'belt':
        return (
          <>
            <ellipse cx="50" cy="54" rx="28" ry="16" strokeLinejoin="round" />
            <ellipse cx="50" cy="54" rx="22" ry="11" strokeLinejoin="round" />
            <rect x="20" y="46" width="12" height="16" rx="2" strokeLinejoin="round" />
            <line x1="26" x2="26" y1="48" y2="60" strokeLinecap="round" fill="none" />
          </>
        );

      case 'umbrella':
        return (
          <>
            <path d="M 24 50 C 24 30 76 30 76 50 Z" strokeLinejoin="round" />
            <line x1="50" x2="50" y1="30" y2="76" strokeLinecap="round" fill="none" />
            <path d="M 50 76 C 50 82 44 82 44 76" strokeLinecap="round" fill="none" />
            <line x1="50" x2="50" y1="26" y2="30" strokeLinecap="round" fill="none" />
          </>
        );

      // =========================================================================
      // 3. TECH, SOUND & PERSONAL ACCESSORIES (6)
      // =========================================================================
      case 'headphones':
        return (
          <>
            <path d="M 28 54 C 28 32 72 32 72 54" strokeLinecap="round" fill="none" />
            <path d="M 32 50 C 32 36 68 36 68 50" strokeLinecap="round" fill="none" />
            <rect height="20" rx="4" strokeLinejoin="round" width="10" x="23" y="52" />
            <rect height="20" rx="4" strokeLinejoin="round" width="10" x="67" y="52" />
          </>
        );

      case 'earbuds':
        return (
          <>
            <rect x="34" y="38" width="32" height="34" rx="8" strokeLinejoin="round" />
            <line x1="34" x2="66" y1="48" y2="48" strokeLinecap="round" fill="none" />
            <circle cx="50" cy="56" r="2" />
          </>
        );

      case 'watch':
        return (
          <>
            <rect x="42" y="16" width="16" height="68" rx="3" strokeLinejoin="round" />
            <circle cx="50" cy="50" r="16" strokeLinejoin="round" />
            <circle cx="50" cy="50" r="1.5" />
            <line x1="50" x2="50" y1="50" y2="40" strokeLinecap="round" fill="none" />
            <line x1="50" x2="58" y1="50" y2="50" strokeLinecap="round" fill="none" />
          </>
        );

      case 'sunglasses':
        return (
          <>
            <circle cx="36" cy="52" r="14" strokeLinejoin="round" />
            <circle cx="64" cy="52" r="14" strokeLinejoin="round" />
            <path d="M 50 48 C 50 44 50 44 50 48" strokeLinecap="round" fill="none" />
            <line x1="48" x2="52" y1="48" y2="48" strokeLinecap="round" fill="none" />
            <line x1="22" x2="16" y1="48" y2="44" strokeLinecap="round" fill="none" />
            <line x1="78" x2="84" y1="48" y2="44" strokeLinecap="round" fill="none" />
          </>
        );

      case 'glasses':
        return (
          <>
            <circle cx="36" cy="52" r="12" strokeLinejoin="round" />
            <circle cx="64" cy="52" r="12" strokeLinejoin="round" />
            <path d="M 48 50 C 50 46 50 46 52 50" strokeLinecap="round" fill="none" />
            <line x1="24" x2="16" y1="48" y2="44" strokeLinecap="round" fill="none" />
            <line x1="76" x2="84" y1="48" y2="44" strokeLinecap="round" fill="none" />
          </>
        );

      case 'pen':
        return (
          <>
            <path d="M 46 16 L 54 16 L 54 68 L 50 78 L 46 68 Z" strokeLinejoin="round" />
            <line x1="46" x2="54" y1="32" y2="32" strokeLinecap="round" fill="none" />
            <line x1="54" x2="58" y1="20" y2="28" strokeLinecap="round" fill="none" />
            <line x1="50" x2="50" y1="70" y2="78" strokeLinecap="round" fill="none" />
          </>
        );

      // =========================================================================
      // 4. CERAMICS, KITCHEN & TABLE (12)
      // =========================================================================
      case 'mug':
        return (
          <>
            <rect height="42" rx="4" strokeLinejoin="round" width="34" x="30" y="30" />
            <path d="M 64 38 C 74 38 74 56 64 58" strokeLinecap="round" fill="none" />
            <line strokeDasharray="2 3" strokeLinecap="round" x1="38" x2="38" y1="23" y2="18" fill="none" />
            <line strokeDasharray="2 3" strokeLinecap="round" x1="47" x2="47" y1="23" y2="16" fill="none" />
            <line strokeDasharray="2 3" strokeLinecap="round" x1="56" x2="56" y1="23" y2="18" fill="none" />
          </>
        );

      case 'cup':
        return (
          <>
            <path d="M 32 36 L 38 72 L 62 72 L 68 36 Z" strokeLinejoin="round" />
            <ellipse cx="50" cy="36" rx="18" ry="4" strokeLinejoin="round" />
            <line x1="38" x2="62" y1="64" y2="64" strokeDasharray="2 2" fill="none" />
          </>
        );

      case 'teapot':
        return (
          <>
            <path d="M 32 46 C 26 56 28 72 44 76 L 56 76 C 72 72 74 56 68 46 Z" strokeLinejoin="round" />
            <ellipse cx="50" cy="46" rx="14" ry="4" strokeLinejoin="round" />
            <circle cx="50" cy="40" r="2.5" />
            <path d="M 34 52 C 22 50 18 42 24 38" strokeLinecap="round" fill="none" />
            <path d="M 66 50 C 78 52 80 64 66 68" strokeLinecap="round" fill="none" />
          </>
        );

      case 'kettle':
        return (
          <>
            <path d="M 34 46 L 30 76 L 70 76 L 66 46 Z" strokeLinejoin="round" />
            <ellipse cx="50" cy="46" rx="16" ry="4" strokeLinejoin="round" />
            <circle cx="50" cy="40" r="2.5" />
            <path d="M 32 64 C 20 62 16 38 26 34" strokeLinecap="round" fill="none" />
            <path d="M 68 48 C 80 48 82 70 70 74" strokeLinecap="round" fill="none" />
          </>
        );

      case 'vase':
        return (
          <>
            <path
              d="M 44 26 L 56 26 L 54 36 C 66 44 68 62 60 76 L 40 76 C 32 62 34 44 46 36 Z"
              strokeLinejoin="round"
            />
            <ellipse cx="50" cy="26" rx="6" ry="2" />
            <ellipse cx="50" cy="56" rx="8" ry="2" strokeDasharray="2 3" fill="none" />
          </>
        );

      case 'bowl':
        return (
          <>
            <path d="M 24 44 C 26 72 74 72 76 44 Z" strokeLinejoin="round" />
            <ellipse cx="50" cy="44" rx="26" ry="7" strokeLinejoin="round" />
            <rect x="42" y="70" width="16" height="4" rx="1" strokeLinejoin="round" />
            <path d="M 42 34 C 42 28 46 28 46 22" strokeLinecap="round" strokeDasharray="2 2" fill="none" />
            <path d="M 52 34 C 52 28 56 28 56 22" strokeLinecap="round" strokeDasharray="2 2" fill="none" />
          </>
        );

      case 'plate':
        return (
          <>
            <ellipse cx="50" cy="54" rx="34" ry="14" strokeLinejoin="round" />
            <ellipse cx="50" cy="54" rx="22" ry="9" strokeLinejoin="round" />
          </>
        );

      case 'pitcher':
        return (
          <>
            <path d="M 38 30 L 32 30 L 30 76 L 68 76 L 64 34 Z" strokeLinejoin="round" />
            <path d="M 64 40 C 76 42 76 64 66 68" strokeLinecap="round" fill="none" />
            <ellipse cx="48" cy="32" rx="14" ry="3" strokeLinejoin="round" />
          </>
        );

      case 'bottle':
        return (
          <>
            <rect x="44" y="20" width="12" height="12" rx="2" strokeLinejoin="round" />
            <path d="M 44 32 L 36 42 L 36 78 L 64 78 L 64 42 L 56 32 Z" strokeLinejoin="round" />
            <line x1="44" x2="56" y1="26" y2="26" strokeLinecap="round" fill="none" />
          </>
        );

      case 'coffee-press':
        return (
          <>
            <rect x="34" y="32" width="32" height="48" rx="4" strokeLinejoin="round" />
            <line x1="50" x2="50" y1="18" y2="32" strokeLinecap="round" fill="none" />
            <line x1="42" x2="58" y1="18" y2="18" strokeLinecap="round" fill="none" />
            <line x1="34" x2="66" y1="52" y2="52" strokeLinecap="round" strokeDasharray="2 2" fill="none" />
            <path d="M 66 40 C 76 40 76 62 66 64" strokeLinecap="round" fill="none" />
          </>
        );

      case 'cutlery':
        return (
          <>
            {/* Fork */}
            <path d="M 34 24 L 34 40 C 34 44 42 44 42 40 L 42 24" strokeLinecap="round" fill="none" />
            <line x1="38" x2="38" y1="24" y2="38" strokeLinecap="round" fill="none" />
            <line x1="38" x2="38" y1="44" y2="76" strokeLinecap="round" fill="none" />
            {/* Knife */}
            <path d="M 62 24 C 62 36 58 44 58 50 L 58 76 L 64 76 L 64 24 Z" strokeLinejoin="round" />
          </>
        );

      case 'tray':
        return (
          <>
            <polygon points="18,62 82,62 76,40 24,40" strokeLinejoin="round" />
            <rect x="26" y="48" width="6" height="3" rx="1" fill="none" />
            <rect x="68" y="48" width="6" height="3" rx="1" fill="none" />
          </>
        );

      // =========================================================================
      // 5. HOME LIVING & STUDIO (15)
      // =========================================================================
      case 'plant':
        return (
          <>
            <polygon points="36,65 64,65 60,86 40,86" strokeLinejoin="round" />
            <line strokeLinecap="round" x1="33" x2="67" y1="65" y2="65" fill="none" />
            <line x1="50" x2="50" y1="65" y2="35" fill="none" />
            <path d="M 50 55 C 38 52 36 42 50 40 C 64 42 62 52 50 55" strokeLinejoin="round" />
            <path d="M 50 45 C 36 40 38 28 50 25 C 62 28 64 40 50 45" strokeLinejoin="round" />
            <path d="M 50 30 C 44 22 46 14 50 12 C 54 14 56 22 50 30" strokeLinejoin="round" />
          </>
        );

      case 'flower':
        return (
          <>
            <path d="M 44 58 L 44 82 L 56 82 L 56 58 C 56 52 44 52 44 58 Z" strokeLinejoin="round" />
            <line x1="50" x2="50" y1="52" y2="28" strokeLinecap="round" fill="none" />
            <circle cx="50" cy="22" r="5" />
            <circle cx="50" cy="14" r="3" fill="none" />
            <circle cx="58" cy="22" r="3" fill="none" />
            <circle cx="50" cy="30" r="3" fill="none" />
            <circle cx="42" cy="22" r="3" fill="none" />
            <path d="M 50 40 C 42 38 42 32 50 34" strokeLinecap="round" fill="none" />
          </>
        );

      case 'lamp':
        return (
          <>
            <ellipse cx="50" cy="80" rx="16" ry="4" />
            <line strokeLinecap="round" x1="50" x2="50" y1="80" y2="42" fill="none" />
            <line strokeLinecap="round" x1="50" x2="38" y1="42" y2="34" fill="none" />
            <polygon points="30,42 46,28 32,24" strokeLinejoin="round" />
            <line strokeDasharray="2 2" strokeLinecap="round" x1="28" x2="22" y1="46" y2="52" fill="none" />
            <line strokeDasharray="2 2" strokeLinecap="round" x1="33" x2="30" y1="49" y2="57" fill="none" />
          </>
        );

      case 'lantern':
        return (
          <>
            <ellipse cx="50" cy="28" rx="14" ry="4" strokeLinejoin="round" />
            <ellipse cx="50" cy="72" rx="14" ry="4" strokeLinejoin="round" />
            <path d="M 36 28 C 24 44 24 56 36 72" strokeLinejoin="round" />
            <path d="M 64 28 C 76 44 76 56 64 72" strokeLinejoin="round" />
            <line x1="50" x2="50" y1="18" y2="28" strokeLinecap="round" fill="none" />
            <line x1="30" x2="70" y1="42" y2="42" strokeDasharray="2 2" fill="none" />
            <line x1="28" x2="72" y1="50" y2="50" strokeDasharray="2 2" fill="none" />
            <line x1="30" x2="70" y1="58" y2="58" strokeDasharray="2 2" fill="none" />
          </>
        );

      case 'candle':
        return (
          <>
            <rect x="38" y="44" width="24" height="38" rx="3" strokeLinejoin="round" />
            <ellipse cx="50" cy="44" rx="12" ry="4" strokeLinejoin="round" />
            <line x1="50" x2="50" y1="42" y2="34" strokeLinecap="round" fill="none" />
            <path d="M 50 34 C 47 30 47 24 50 20 C 53 24 53 30 50 34 Z" strokeLinejoin="round" />
          </>
        );

      case 'cushion':
        return (
          <>
            <rect x="24" y="28" width="52" height="52" rx="14" strokeLinejoin="round" />
            <circle cx="50" cy="54" r="3" />
            <line x1="24" x2="47" y1="28" y2="52" strokeDasharray="2 3" fill="none" />
            <line x1="76" x2="53" y1="28" y2="52" strokeDasharray="2 3" fill="none" />
            <line x1="24" x2="47" y1="80" y2="56" strokeDasharray="2 3" fill="none" />
            <line x1="76" x2="53" y1="80" y2="56" strokeDasharray="2 3" fill="none" />
          </>
        );

      case 'blanket':
        return (
          <>
            <rect x="28" y="32" width="44" height="14" rx="3" strokeLinejoin="round" />
            <rect x="26" y="46" width="48" height="14" rx="3" strokeLinejoin="round" />
            <rect x="24" y="60" width="52" height="16" rx="3" strokeLinejoin="round" />
            <line x1="24" x2="76" y1="74" y2="74" strokeDasharray="2 2" fill="none" />
          </>
        );

      case 'chair':
        return (
          <>
            {/* Backrest */}
            <path d="M 32 20 C 42 16 58 16 68 20 L 66 50 L 34 50 Z" strokeLinejoin="round" />
            {/* Seat */}
            <ellipse cx="50" cy="54" rx="22" ry="6" strokeLinejoin="round" />
            {/* Legs */}
            <line x1="34" x2="28" y1="56" y2="82" strokeLinecap="round" fill="none" />
            <line x1="66" x2="72" y1="56" y2="82" strokeLinecap="round" fill="none" />
            <line x1="44" x2="40" y1="56" y2="80" strokeLinecap="round" fill="none" />
            <line x1="56" x2="60" y1="56" y2="80" strokeLinecap="round" fill="none" />
          </>
        );

      case 'stool':
        return (
          <>
            <ellipse cx="50" cy="38" rx="22" ry="7" strokeLinejoin="round" />
            <line x1="34" x2="26" y1="42" y2="80" strokeLinecap="round" fill="none" />
            <line x1="66" x2="74" y1="42" y2="80" strokeLinecap="round" fill="none" />
            <line x1="50" x2="50" y1="44" y2="78" strokeLinecap="round" fill="none" />
            <line x1="30" x2="70" y1="62" y2="62" strokeLinecap="round" fill="none" />
          </>
        );

      case 'mirror':
        return (
          <>
            <path d="M 32 78 L 32 40 C 32 24 68 24 68 40 L 68 78 Z" strokeLinejoin="round" />
            <line x1="24" x2="76" y1="80" y2="80" strokeLinecap="round" strokeWidth="2" fill="none" />
            <line x1="40" x2="48" y1="40" y2="48" strokeLinecap="round" strokeDasharray="1 3" fill="none" />
          </>
        );

      case 'clock':
        return (
          <>
            <circle cx="50" cy="50" r="28" strokeLinejoin="round" />
            <circle cx="50" cy="50" r="2" />
            <line x1="50" x2="50" y1="50" y2="32" strokeLinecap="round" fill="none" />
            <line x1="50" x2="62" y1="50" y2="50" strokeLinecap="round" fill="none" />
            <line x1="50" x2="50" y1="24" y2="28" strokeLinecap="round" fill="none" />
            <line x1="50" x2="50" y1="72" y2="76" strokeLinecap="round" fill="none" />
            <line x1="24" x2="28" y1="50" y2="50" strokeLinecap="round" fill="none" />
            <line x1="72" x2="76" y1="50" y2="50" strokeLinecap="round" fill="none" />
          </>
        );

      case 'basket':
        return (
          <>
            <ellipse cx="50" cy="38" rx="26" ry="8" strokeLinejoin="round" />
            <path d="M 24 38 L 30 76 C 32 80 68 80 70 76 L 76 38" strokeLinejoin="round" />
            <line x1="26" x2="74" y1="50" y2="50" strokeDasharray="3 3" fill="none" />
            <line x1="28" x2="72" y1="62" y2="62" strokeDasharray="3 3" fill="none" />
            <path d="M 40 34 C 40 24 60 24 60 34" strokeLinecap="round" fill="none" />
          </>
        );

      case 'notebook':
        return (
          <>
            <rect x="28" y="24" width="44" height="58" rx="4" strokeLinejoin="round" />
            <line x1="36" x2="36" y1="24" y2="82" strokeLinecap="round" fill="none" />
            <line x1="42" x2="64" y1="36" y2="36" strokeLinecap="round" fill="none" />
            <line x1="42" x2="64" y1="46" y2="46" strokeLinecap="round" fill="none" />
            <line x1="42" x2="56" y1="56" y2="56" strokeLinecap="round" fill="none" />
            <path d="M 52 24 L 52 40 L 56 36 L 60 40 L 60 24" strokeLinejoin="round" />
          </>
        );

      case 'diffuser':
        return (
          <>
            <rect x="36" y="52" width="28" height="30" rx="6" strokeLinejoin="round" />
            <rect x="44" y="46" width="12" height="6" rx="1" strokeLinejoin="round" />
            <line x1="50" x2="42" y1="46" y2="18" strokeLinecap="round" fill="none" />
            <line x1="50" x2="50" y1="46" y2="14" strokeLinecap="round" fill="none" />
            <line x1="50" x2="58" y1="46" y2="18" strokeLinecap="round" fill="none" />
            <line x1="50" x2="36" y1="46" y2="24" strokeLinecap="round" fill="none" />
            <line x1="50" x2="64" y1="46" y2="24" strokeLinecap="round" fill="none" />
          </>
        );

      case 'towel':
        return (
          <>
            <rect x="26" y="32" width="48" height="12" rx="3" strokeLinejoin="round" />
            <rect x="24" y="44" width="52" height="14" rx="3" strokeLinejoin="round" />
            <rect x="22" y="58" width="56" height="16" rx="4" strokeLinejoin="round" />
            <line x1="30" x2="70" y1="66" y2="66" strokeDasharray="2 3" fill="none" />
          </>
        );

      // =========================================================================
      // 6. APPAREL & WEARABLES (NEW 10)
      // =========================================================================
      case 'blazer':
        return (
          <>
            <path
              d="M 32 20 L 44 24 L 56 24 L 68 20 L 82 32 L 74 44 L 68 40 L 68 84 L 32 84 L 32 40 L 26 44 L 18 32 Z"
              strokeLinejoin="round"
            />
            <path d="M 44 24 L 38 46 L 50 62 L 62 46 L 56 24" strokeLinejoin="round" fill="none" />
            <line x1="50" x2="50" y1="62" y2="84" strokeLinecap="round" fill="none" />
            <circle cx="50" cy="68" r="1.5" />
            <line x1="34" x2="42" y1="64" y2="64" strokeLinecap="round" fill="none" />
            <line x1="58" x2="66" y1="64" y2="64" strokeLinecap="round" fill="none" />
          </>
        );

      case 'cardigan':
        return (
          <>
            <path
              d="M 32 22 L 42 26 L 58 26 L 68 22 L 84 34 L 76 46 L 70 42 L 70 82 L 30 82 L 30 42 L 24 46 L 16 34 Z"
              strokeLinejoin="round"
            />
            <path d="M 42 26 L 50 48 L 58 26" strokeLinecap="round" fill="none" />
            <line x1="50" x2="50" y1="48" y2="82" strokeLinecap="round" fill="none" />
            <circle cx="50" cy="54" r="1.5" />
            <circle cx="50" cy="64" r="1.5" />
            <circle cx="50" cy="74" r="1.5" />
            <line x1="30" x2="70" y1="78" y2="78" strokeDasharray="3 2" fill="none" />
          </>
        );

      case 'turtleneck':
        return (
          <>
            <rect x="42" y="14" width="16" height="14" rx="2" strokeLinejoin="round" />
            <line x1="42" x2="58" y1="21" y2="21" strokeLinecap="round" fill="none" />
            <path
              d="M 42 26 L 30 30 L 16 42 L 24 52 L 30 48 L 30 84 L 70 84 L 70 48 L 76 52 L 84 42 L 70 30 L 58 26 Z"
              strokeLinejoin="round"
            />
            <line x1="42" x2="30" y1="28" y2="48" strokeLinecap="round" fill="none" />
            <line x1="58" x2="70" y1="28" y2="48" strokeLinecap="round" fill="none" />
          </>
        );

      case 'tanktop':
        return (
          <>
            <path
              d="M 34 22 L 40 22 C 42 32 58 32 60 22 L 66 22 L 68 40 L 66 84 L 34 84 L 32 40 Z"
              strokeLinejoin="round"
            />
            <path d="M 40 22 C 42 38 58 38 60 22" strokeLinecap="round" fill="none" />
            <line x1="46" x2="46" y1="44" y2="78" strokeDasharray="2 3" fill="none" />
            <line x1="54" x2="54" y1="44" y2="78" strokeDasharray="2 3" fill="none" />
          </>
        );

      case 'skirt':
        return (
          <>
            <rect x="34" y="24" width="32" height="6" rx="1" strokeLinejoin="round" />
            <path d="M 34 30 L 22 82 L 78 82 L 66 30 Z" strokeLinejoin="round" />
            <line x1="36" x2="33" y1="30" y2="82" strokeLinecap="round" fill="none" />
            <line x1="45" x2="44" y1="30" y2="82" strokeLinecap="round" fill="none" />
            <line x1="55" x2="56" y1="30" y2="82" strokeLinecap="round" fill="none" />
            <line x1="64" x2="67" y1="30" y2="82" strokeLinecap="round" fill="none" />
          </>
        );

      case 'overalls':
        return (
          <>
            <line x1="38" x2="38" y1="20" y2="34" strokeLinecap="round" fill="none" />
            <line x1="62" x2="62" y1="20" y2="34" strokeLinecap="round" fill="none" />
            <rect x="36" y="32" width="4" height="4" rx="1" strokeLinejoin="round" />
            <rect x="60" y="32" width="4" height="4" rx="1" strokeLinejoin="round" />
            <path d="M 34 36 L 66 36 L 66 52 L 34 52 Z" strokeLinejoin="round" />
            <rect x="44" y="40" width="12" height="8" rx="1" strokeLinejoin="round" />
            <path d="M 32 52 L 28 86 L 47 86 L 50 62 L 53 86 L 72 86 L 68 52 Z" strokeLinejoin="round" />
          </>
        );

      case 'gloves':
        return (
          <>
            <path d="M 28 44 C 28 32 38 32 40 40 C 44 42 46 48 42 54 L 40 68 L 28 68 Z" strokeLinejoin="round" />
            <path d="M 72 44 C 72 32 62 32 60 40 C 56 42 54 48 58 54 L 60 68 L 72 68 Z" strokeLinejoin="round" />
            <rect x="26" y="68" width="16" height="8" rx="2" strokeLinejoin="round" />
            <rect x="58" y="68" width="16" height="8" rx="2" strokeLinejoin="round" />
          </>
        );

      case 'apron':
        return (
          <>
            <path d="M 40 18 C 40 14 60 14 60 18 L 60 26 L 40 26 Z" strokeLinejoin="round" fill="none" />
            <path d="M 40 26 L 60 26 L 64 48 L 70 48 L 70 86 L 30 86 L 30 48 L 36 48 Z" strokeLinejoin="round" />
            <rect x="38" y="56" width="24" height="18" rx="2" strokeLinejoin="round" />
            <line x1="50" x2="50" y1="56" y2="74" strokeLinecap="round" fill="none" />
          </>
        );

      case 'belt-buckle':
        return (
          <>
            <rect x="14" y="42" width="72" height="16" rx="2" strokeLinejoin="round" />
            <rect x="36" y="36" width="28" height="28" rx="3" strokeLinejoin="round" />
            <line x1="50" x2="50" y1="36" y2="64" strokeLinecap="round" fill="none" />
            <circle cx="26" cy="50" r="1.5" />
            <circle cx="20" cy="50" r="1.5" />
          </>
        );

      case 'raincoat':
        return (
          <>
            <path d="M 38 24 C 38 12 62 12 62 24" strokeLinecap="round" fill="none" />
            <line x1="44" x2="44" y1="26" y2="34" strokeLinecap="round" fill="none" />
            <line x1="56" x2="56" y1="26" y2="34" strokeLinecap="round" fill="none" />
            <path
              d="M 34 26 L 18 38 L 26 48 L 30 44 L 28 88 L 72 88 L 70 44 L 74 48 L 82 38 L 66 26 Z"
              strokeLinejoin="round"
            />
            <line x1="50" x2="50" y1="26" y2="88" strokeLinecap="round" fill="none" />
            <rect x="34" y="60" width="10" height="12" rx="2" strokeLinejoin="round" />
            <rect x="56" y="60" width="10" height="12" rx="2" strokeLinejoin="round" />
          </>
        );

      // =========================================================================
      // 7. FOOTWEAR & CARRY (NEW 8)
      // =========================================================================
      case 'clogs':
        return (
          <>
            <path d="M 16 56 C 20 44 42 42 56 50 L 64 56 C 72 56 82 60 84 66 L 16 66 Z" strokeLinejoin="round" />
            <path d="M 16 66 L 84 66 L 82 76 L 68 76 L 64 72 L 32 72 L 30 78 L 16 78 Z" strokeLinejoin="round" />
            <circle cx="36" cy="62" r="1" />
            <circle cx="48" cy="62" r="1" />
            <circle cx="60" cy="62" r="1" />
          </>
        );

      case 'derby':
        return (
          <>
            <path d="M 14 70 L 86 70 L 86 76 L 66 76 L 62 72 L 28 72 L 24 76 L 14 76 Z" strokeLinejoin="round" />
            <path d="M 16 70 C 18 52 30 46 46 48 L 60 42 L 68 54 L 84 64 L 84 70 Z" strokeLinejoin="round" />
            <line x1="52" x2="58" y1="46" y2="52" strokeLinecap="round" fill="none" />
            <line x1="50" x2="56" y1="50" y2="56" strokeLinecap="round" fill="none" />
          </>
        );

      case 'chelsea-boot':
        return (
          <>
            <path d="M 32 24 L 56 24 L 56 46 L 78 58 L 78 72 L 22 72 L 22 40 L 32 24 Z" strokeLinejoin="round" />
            <path d="M 40 24 L 38 48 L 48 48 L 46 24 Z" strokeLinejoin="round" fill="none" />
            <path d="M 32 24 L 30 18 L 34 18 L 34 24" strokeLinejoin="round" fill="none" />
            <path d="M 20 72 L 80 72 L 80 78 L 60 78 L 56 74 L 34 74 L 30 78 L 20 78 Z" strokeLinejoin="round" />
          </>
        );

      case 'messenger-bag':
        return (
          <>
            <rect x="22" y="38" width="56" height="42" rx="4" strokeLinejoin="round" />
            <path d="M 22 38 L 78 38 L 76 62 C 76 65 73 68 70 68 L 30 68 C 27 68 24 65 24 62 Z" strokeLinejoin="round" />
            <rect x="32" y="60" width="6" height="12" rx="1" strokeLinejoin="round" />
            <rect x="62" y="60" width="6" height="12" rx="1" strokeLinejoin="round" />
            <path d="M 22 42 C 22 18 78 18 78 42" strokeLinecap="round" fill="none" />
          </>
        );

      case 'clutch':
        return (
          <>
            <rect x="20" y="30" width="60" height="46" rx="3" strokeLinejoin="round" />
            <path d="M 20 30 L 50 56 L 80 30" strokeLinejoin="round" fill="none" />
            <circle cx="50" cy="56" r="2" />
          </>
        );

      case 'fanny-pack':
        return (
          <>
            <path d="M 22 46 C 22 36 78 36 78 46 C 78 62 22 62 22 46 Z" strokeLinejoin="round" />
            <path d="M 26 44 C 36 40 64 40 74 44" strokeLinecap="round" fill="none" />
            <line x1="36" x2="64" y1="52" y2="52" strokeLinecap="round" fill="none" />
            <line x1="22" x2="12" y1="46" y2="46" strokeLinecap="round" fill="none" />
            <line x1="78" x2="88" y1="46" y2="46" strokeLinecap="round" fill="none" />
          </>
        );

      case 'luggage':
        return (
          <>
            <path d="M 44 14 L 56 14 M 44 14 L 44 26 M 56 14 L 56 26" strokeLinecap="round" fill="none" />
            <rect x="28" y="26" width="44" height="54" rx="4" strokeLinejoin="round" />
            <line x1="34" x2="66" y1="36" y2="36" strokeLinecap="round" fill="none" />
            <line x1="34" x2="66" y1="46" y2="46" strokeLinecap="round" fill="none" />
            <line x1="34" x2="66" y1="56" y2="56" strokeLinecap="round" fill="none" />
            <line x1="34" x2="66" y1="66" y2="66" strokeLinecap="round" fill="none" />
            <circle cx="36" cy="84" r="3" />
            <circle cx="64" cy="84" r="3" />
          </>
        );

      case 'cardholder':
        return (
          <>
            <rect x="26" y="30" width="48" height="44" rx="3" strokeLinejoin="round" />
            <path d="M 26 42 C 40 46 60 46 74 42" strokeLinecap="round" fill="none" />
            <path d="M 26 54 C 40 58 60 58 74 54" strokeLinecap="round" fill="none" />
            <line x1="46" x2="54" y1="64" y2="64" strokeLinecap="round" fill="none" />
          </>
        );

      // =========================================================================
      // 8. CERAMICS, KITCHEN & DINING (NEW 13)
      // =========================================================================
      case 'matcha-whisk':
        return (
          <>
            <rect x="45" y="16" width="10" height="26" rx="2" strokeLinejoin="round" />
            <rect x="43" y="34" width="14" height="4" rx="1" strokeLinejoin="round" />
            <path d="M 43 38 C 30 50 30 76 34 82 C 42 84 58 84 66 82 C 70 76 70 50 57 38 Z" strokeLinejoin="round" />
            <path d="M 47 42 C 44 56 46 72 50 78 C 54 72 56 56 53 42" strokeLinecap="round" fill="none" />
          </>
        );

      case 'matcha-bowl':
        return (
          <>
            <ellipse cx="50" cy="34" rx="32" ry="7" strokeLinejoin="round" />
            <path d="M 18 34 C 18 64 32 78 40 80 L 60 80 C 68 78 82 64 82 34" strokeLinejoin="round" />
            <rect x="40" y="80" width="20" height="5" rx="1" strokeLinejoin="round" />
          </>
        );

      case 'pour-over':
        return (
          <>
            <path d="M 28 20 L 72 20 L 56 44 L 44 44 Z" strokeLinejoin="round" />
            <line x1="32" x2="68" y1="18" y2="18" strokeLinecap="round" fill="none" />
            <path d="M 38 48 L 30 78 C 30 82 34 84 40 84 L 60 84 C 66 84 70 82 70 78 L 62 48 Z" strokeLinejoin="round" />
            <path d="M 66 52 C 76 54 76 72 66 74" strokeLinecap="round" fill="none" />
          </>
        );

      case 'mortar-pestle':
        return (
          <>
            <path d="M 20 44 C 20 74 34 80 50 80 C 66 80 80 74 80 44 Z" strokeLinejoin="round" />
            <ellipse cx="50" cy="44" rx="30" ry="6" strokeLinejoin="round" />
            <path d="M 54 18 L 62 20 C 66 30 58 48 48 54 L 44 50 C 48 40 50 26 54 18 Z" strokeLinejoin="round" />
          </>
        );

      case 'chopsticks':
        return (
          <>
            <line x1="20" x2="80" y1="20" y2="76" strokeLinecap="round" />
            <line x1="26" x2="84" y1="18" y2="72" strokeLinecap="round" />
            <rect x="46" y="52" width="16" height="7" rx="3" transform="rotate(-15 54 55)" strokeLinejoin="round" />
          </>
        );

      case 'serving-board':
        return (
          <>
            <rect x="26" y="16" width="48" height="58" rx="6" strokeLinejoin="round" />
            <rect x="44" y="74" width="12" height="14" rx="2" strokeLinejoin="round" />
            <circle cx="50" cy="82" r="2.5" fill="none" />
            <rect x="31" y="21" width="38" height="48" rx="4" strokeLinejoin="round" fill="none" />
          </>
        );

      case 'carafe':
        return (
          <>
            <ellipse cx="50" cy="20" rx="14" ry="4" strokeLinejoin="round" />
            <path d="M 36 20 C 40 32 42 38 38 52 C 32 66 30 78 34 82 C 38 84 62 84 66 82 C 70 78 68 66 62 52 C 58 38 60 32 64 20" strokeLinejoin="round" />
            <path d="M 33 66 C 44 68 56 68 67 66" strokeLinecap="round" fill="none" />
          </>
        );

      case 'salt-pepper':
        return (
          <>
            <rect x="22" y="36" width="22" height="42" rx="4" strokeLinejoin="round" />
            <path d="M 22 36 C 22 28 44 28 44 36 Z" strokeLinejoin="round" />
            <circle cx="33" cy="31" r="1" />
            <rect x="56" y="36" width="22" height="42" rx="4" strokeLinejoin="round" />
            <path d="M 56 36 C 56 28 78 28 78 36 Z" strokeLinejoin="round" />
            <circle cx="64" cy="31" r="1" />
            <circle cx="70" cy="31" r="1" />
          </>
        );

      case 'wine-goblet':
        return (
          <>
            <path d="M 32 20 C 32 50 44 56 48 58 L 48 78 L 38 78 L 38 82 L 62 82 L 62 78 L 52 78 L 52 58 C 56 56 68 50 68 20 Z" strokeLinejoin="round" />
            <ellipse cx="50" cy="20" rx="18" ry="4" strokeLinejoin="round" />
            <path d="M 34 38 C 44 42 56 42 66 38" strokeLinecap="round" fill="none" />
          </>
        );

      case 'espresso-cup':
        return (
          <>
            <ellipse cx="50" cy="74" rx="34" ry="7" strokeLinejoin="round" />
            <path d="M 30 40 L 32 66 C 34 72 66 72 68 66 L 70 40 Z" strokeLinejoin="round" />
            <ellipse cx="50" cy="40" rx="20" ry="4" strokeLinejoin="round" />
            <path d="M 70 44 C 78 46 78 60 68 62" strokeLinecap="round" fill="none" />
          </>
        );

      case 'sauce-dish':
        return (
          <>
            <ellipse cx="50" cy="52" rx="34" ry="12" strokeLinejoin="round" />
            <ellipse cx="50" cy="54" rx="24" ry="7" strokeLinejoin="round" />
            <path d="M 30 58 C 34 68 66 68 70 58" strokeLinejoin="round" fill="none" />
          </>
        );

      case 'jar':
        return (
          <>
            <path d="M 40 18 L 60 18 L 58 28 L 42 28 Z" strokeLinejoin="round" />
            <rect x="36" y="28" width="28" height="6" rx="2" strokeLinejoin="round" />
            <rect x="28" y="34" width="44" height="48" rx="5" strokeLinejoin="round" />
            <rect x="36" y="48" width="28" height="18" rx="2" strokeLinejoin="round" fill="none" />
          </>
        );

      case 'cooking-pot':
        return (
          <>
            <rect x="46" y="24" width="8" height="6" rx="2" strokeLinejoin="round" />
            <path d="M 24 44 C 24 32 76 32 76 44 Z" strokeLinejoin="round" />
            <path d="M 22 44 L 24 74 C 26 80 74 80 76 74 L 78 44 Z" strokeLinejoin="round" />
            <path d="M 16 48 C 16 44 22 44 22 48" strokeLinecap="round" fill="none" />
            <path d="M 84 48 C 84 44 78 44 78 48" strokeLinecap="round" fill="none" />
          </>
        );

      // =========================================================================
      // 9. HOME LIVING & STUDIO (NEW 10)
      // =========================================================================
      case 'bonsai':
        return (
          <>
            <path d="M 24 70 L 76 70 L 72 82 L 28 82 Z" strokeLinejoin="round" />
            <line x1="20" x2="80" y1="70" y2="70" strokeLinecap="round" />
            <path d="M 46 70 C 44 58 54 52 50 42 C 46 36 50 30 48 24" strokeLinecap="round" fill="none" />
            <ellipse cx="44" cy="22" rx="14" ry="7" strokeLinejoin="round" />
            <ellipse cx="60" cy="34" rx="16" ry="8" strokeLinejoin="round" />
            <ellipse cx="36" cy="46" rx="12" ry="6" strokeLinejoin="round" />
          </>
        );

      case 'desk':
        return (
          <>
            <rect x="18" y="34" width="64" height="6" rx="2" strokeLinejoin="round" />
            <rect x="24" y="40" width="52" height="10" rx="1" strokeLinejoin="round" />
            <circle cx="50" cy="45" r="1.5" />
            <line x1="26" x2="20" y1="50" y2="82" strokeLinecap="round" />
            <line x1="74" x2="80" y1="50" y2="82" strokeLinecap="round" />
            <line x1="22" x2="78" y1="68" y2="68" strokeLinecap="round" fill="none" />
          </>
        );

      case 'shelf':
        return (
          <>
            <rect x="16" y="62" width="68" height="6" rx="2" strokeLinejoin="round" />
            <line x1="26" x2="26" y1="68" y2="76" strokeLinecap="round" fill="none" />
            <line x1="74" x2="74" y1="68" y2="76" strokeLinecap="round" fill="none" />
            <rect x="24" y="34" width="7" height="28" rx="1" strokeLinejoin="round" />
            <rect x="32" y="30" width="8" height="32" rx="1" strokeLinejoin="round" />
            <rect x="41" y="38" width="7" height="24" rx="1" strokeLinejoin="round" />
            <path d="M 58 46 L 68 46 L 66 62 L 60 62 Z" strokeLinejoin="round" />
          </>
        );

      case 'bench':
        return (
          <>
            <rect x="16" y="44" width="68" height="6" rx="2" strokeLinejoin="round" />
            <line x1="24" x2="76" y1="64" y2="64" strokeLinecap="round" fill="none" />
            <line x1="22" x2="20" y1="50" y2="78" strokeLinecap="round" />
            <line x1="28" x2="26" y1="50" y2="78" strokeLinecap="round" />
            <line x1="72" x2="74" y1="50" y2="78" strokeLinecap="round" />
            <line x1="78" x2="80" y1="50" y2="78" strokeLinecap="round" />
          </>
        );

      case 'rug':
        return (
          <>
            <rect x="24" y="24" width="52" height="52" rx="2" strokeLinejoin="round" />
            <line x1="28" x2="28" y1="20" y2="24" strokeLinecap="round" fill="none" />
            <line x1="38" x2="38" y1="20" y2="24" strokeLinecap="round" fill="none" />
            <line x1="50" x2="50" y1="20" y2="24" strokeLinecap="round" fill="none" />
            <line x1="62" x2="62" y1="20" y2="24" strokeLinecap="round" fill="none" />
            <line x1="72" x2="72" y1="20" y2="24" strokeLinecap="round" fill="none" />
            <line x1="28" x2="28" y1="76" y2="80" strokeLinecap="round" fill="none" />
            <line x1="38" x2="38" y1="76" y2="80" strokeLinecap="round" fill="none" />
            <line x1="50" x2="50" y1="76" y2="80" strokeLinecap="round" fill="none" />
            <line x1="62" x2="62" y1="76" y2="80" strokeLinecap="round" fill="none" />
            <line x1="72" x2="72" y1="76" y2="80" strokeLinecap="round" fill="none" />
            <polygon points="50,34 62,50 50,66 38,50" strokeLinejoin="round" fill="none" />
          </>
        );

      case 'floor-lamp':
        return (
          <>
            <rect x="20" y="82" width="24" height="6" rx="2" strokeLinejoin="round" />
            <path d="M 32 82 L 32 46 C 32 20 74 18 74 38" strokeLinecap="round" fill="none" />
            <path d="M 64 38 C 64 34 84 34 84 38 L 86 48 L 62 48 Z" strokeLinejoin="round" />
            <circle cx="74" cy="51" r="2" />
          </>
        );

      case 'incense':
        return (
          <>
            <path d="M 18 72 C 30 76 70 76 82 72 L 80 78 C 68 82 32 82 20 78 Z" strokeLinejoin="round" />
            <line x1="24" x2="68" y1="72" y2="34" strokeLinecap="round" />
            <circle cx="68" cy="34" r="1.5" />
            <path d="M 68 32 C 72 26 66 22 72 16" strokeLinecap="round" fill="none" />
          </>
        );

      case 'watering-can':
        return (
          <>
            <rect x="28" y="44" width="36" height="36" rx="4" strokeLinejoin="round" />
            <line x1="32" x2="14" y1="74" y2="40" strokeLinecap="round" />
            <rect x="12" y="38" width="4" height="6" rx="1" strokeLinejoin="round" />
            <path d="M 36 44 C 36 28 60 28 60 44" strokeLinecap="round" fill="none" />
          </>
        );

      case 'curtain':
        return (
          <>
            <line x1="16" x2="84" y1="18" y2="18" strokeLinecap="round" />
            <circle cx="16" cy="18" r="2.5" />
            <circle cx="84" cy="18" r="2.5" />
            <path d="M 22 20 C 26 22 28 20 32 20 L 30 82 L 20 82 Z" strokeLinejoin="round" />
            <path d="M 68 20 C 72 20 74 22 78 20 L 80 82 L 70 82 Z" strokeLinejoin="round" />
            <line x1="18" x2="31" y1="52" y2="52" strokeLinecap="round" fill="none" />
            <line x1="69" x2="82" y1="52" y2="52" strokeLinecap="round" fill="none" />
          </>
        );

      case 'coat-rack':
        return (
          <>
            <line x1="50" x2="50" y1="14" y2="84" strokeLinecap="round" />
            <circle cx="50" cy="14" r="2.5" />
            <line x1="50" x2="36" y1="26" y2="20" strokeLinecap="round" fill="none" />
            <line x1="50" x2="64" y1="36" y2="30" strokeLinecap="round" fill="none" />
            <line x1="50" x2="36" y1="46" y2="40" strokeLinecap="round" fill="none" />
            <line x1="50" x2="32" y1="84" y2="88" strokeLinecap="round" fill="none" />
            <line x1="50" x2="68" y1="84" y2="88" strokeLinecap="round" fill="none" />
          </>
        );

      // =========================================================================
      // 10. TECH, SOUND, WELLNESS & PERSONAL (NEW 14)
      // =========================================================================
      case 'laptop':
        return (
          <>
            <rect x="22" y="24" width="56" height="38" rx="3" strokeLinejoin="round" />
            <rect x="26" y="28" width="48" height="30" rx="1" strokeLinejoin="round" fill="none" />
            <path d="M 14 66 L 86 66 L 82 74 L 18 74 Z" strokeLinejoin="round" />
            <rect x="42" y="68" width="16" height="4" rx="1" strokeLinejoin="round" fill="none" />
          </>
        );

      case 'camera':
        return (
          <>
            <rect x="18" y="32" width="64" height="42" rx="4" strokeLinejoin="round" />
            <rect x="24" y="24" width="22" height="8" rx="2" strokeLinejoin="round" />
            <rect x="68" y="26" width="8" height="6" rx="1" strokeLinejoin="round" />
            <circle cx="50" cy="54" r="16" strokeLinejoin="round" />
            <circle cx="50" cy="54" r="9" strokeLinejoin="round" fill="none" />
            <rect x="68" y="38" width="8" height="6" rx="1" strokeLinejoin="round" />
          </>
        );

      case 'speaker':
        return (
          <>
            <rect x="32" y="22" width="36" height="58" rx="18" strokeLinejoin="round" />
            <ellipse cx="50" cy="22" rx="18" ry="6" strokeLinejoin="round" />
            <line x1="42" x2="58" y1="36" y2="36" strokeLinecap="round" fill="none" />
            <line x1="38" x2="62" y1="46" y2="46" strokeLinecap="round" fill="none" />
            <line x1="38" x2="62" y1="56" y2="56" strokeLinecap="round" fill="none" />
            <line x1="42" x2="58" y1="66" y2="66" strokeLinecap="round" fill="none" />
          </>
        );

      case 'phone':
        return (
          <>
            <rect x="30" y="16" width="40" height="68" rx="7" strokeLinejoin="round" />
            <line x1="44" x2="56" y1="22" y2="22" strokeLinecap="round" fill="none" />
            <circle cx="50" cy="26" r="1.5" />
            <line x1="42" x2="58" y1="76" y2="76" strokeLinecap="round" fill="none" />
          </>
        );

      case 'turntable':
        return (
          <>
            <rect x="18" y="30" width="64" height="50" rx="4" strokeLinejoin="round" />
            <circle cx="44" cy="55" r="18" strokeLinejoin="round" />
            <circle cx="44" cy="55" r="6" strokeLinejoin="round" fill="none" />
            <line x1="72" x2="72" y1="38" y2="48" strokeLinecap="round" fill="none" />
            <line x1="72" x2="54" y1="48" y2="60" strokeLinecap="round" fill="none" />
            <circle cx="26" cy="38" r="3" />
          </>
        );

      case 'radio':
        return (
          <>
            <rect x="18" y="28" width="64" height="46" rx="4" strokeLinejoin="round" />
            <line x1="24" x2="16" y1="28" y2="14" strokeLinecap="round" fill="none" />
            <circle cx="36" cy="52" r="14" strokeLinejoin="round" />
            <line x1="28" x2="44" y1="52" y2="52" strokeLinecap="round" fill="none" />
            <line x1="30" x2="42" y1="46" y2="46" strokeLinecap="round" fill="none" />
            <line x1="30" x2="42" y1="58" y2="58" strokeLinecap="round" fill="none" />
            <circle cx="66" cy="44" r="7" strokeLinejoin="round" />
            <circle cx="66" cy="62" r="4" strokeLinejoin="round" />
          </>
        );

      case 'soap':
        return (
          <>
            <rect x="26" y="40" width="48" height="34" rx="4" strokeLinejoin="round" />
            <rect x="32" y="46" width="36" height="22" rx="2" strokeLinejoin="round" fill="none" />
            <circle cx="34" cy="30" r="5" fill="none" />
            <circle cx="46" cy="24" r="7" fill="none" />
            <circle cx="58" cy="30" r="4" fill="none" />
            <circle cx="64" cy="22" r="3" fill="none" />
          </>
        );

      case 'perfume':
        return (
          <>
            <rect x="30" y="40" width="40" height="44" rx="4" strokeLinejoin="round" />
            <rect x="42" y="30" width="16" height="10" rx="1" strokeLinejoin="round" />
            <rect x="44" y="22" width="12" height="8" rx="1" strokeLinejoin="round" />
            <line x1="56" x2="68" y1="26" y2="20" strokeDasharray="1 2" strokeLinecap="round" fill="none" />
            <line x1="56" x2="72" y1="26" y2="26" strokeDasharray="1 2" strokeLinecap="round" fill="none" />
            <line x1="56" x2="68" y1="26" y2="32" strokeDasharray="1 2" strokeLinecap="round" fill="none" />
          </>
        );

      case 'comb':
        return (
          <>
            <path d="M 20 36 C 20 28 80 28 80 36 L 80 46 L 20 46 Z" strokeLinejoin="round" />
            <line x1="26" x2="26" y1="46" y2="72" strokeLinecap="round" fill="none" />
            <line x1="34" x2="34" y1="46" y2="72" strokeLinecap="round" fill="none" />
            <line x1="42" x2="42" y1="46" y2="72" strokeLinecap="round" fill="none" />
            <line x1="50" x2="50" y1="46" y2="72" strokeLinecap="round" fill="none" />
            <line x1="58" x2="58" y1="46" y2="72" strokeLinecap="round" fill="none" />
            <line x1="66" x2="66" y1="46" y2="72" strokeLinecap="round" fill="none" />
            <line x1="74" x2="74" y1="46" y2="72" strokeLinecap="round" fill="none" />
          </>
        );

      case 'scissor':
        return (
          <>
            <circle cx="32" cy="74" r="10" strokeLinejoin="round" />
            <circle cx="68" cy="74" r="10" strokeLinejoin="round" />
            <circle cx="50" cy="50" r="2.5" />
            <path d="M 32 64 L 50 50 L 38 18 Z" strokeLinejoin="round" />
            <path d="M 68 64 L 50 50 L 62 18 Z" strokeLinejoin="round" />
          </>
        );

      case 'keychain':
        return (
          <>
            <circle cx="44" cy="34" r="14" strokeLinejoin="round" />
            <path d="M 44 48 L 44 80 L 48 80 L 48 76 L 44 74 M 48 70 L 44 68" strokeLinecap="round" fill="none" />
            <path d="M 52 44 L 68 68 L 71 65 L 68 62 M 65 59 L 62 56" strokeLinecap="round" fill="none" />
          </>
        );

      case 'pocket-knife':
        return (
          <>
            <rect x="22" y="52" width="56" height="16" rx="4" strokeLinejoin="round" />
            <circle cx="28" cy="60" r="1.5" />
            <circle cx="72" cy="60" r="1.5" />
            <path d="M 72 56 C 72 40 56 22 28 22 L 32 36 L 72 52 Z" strokeLinejoin="round" />
            <line x1="42" x2="52" y1="30" y2="34" strokeLinecap="round" fill="none" />
          </>
        );

      case 'journal-pen':
        return (
          <>
            <path d="M 18 30 C 34 26 46 30 50 32 L 50 78 C 46 76 34 72 18 76 Z" strokeLinejoin="round" />
            <path d="M 82 30 C 66 26 54 30 50 32 L 50 78 C 54 76 66 72 82 76 Z" strokeLinejoin="round" />
            <path d="M 50 32 C 54 44 46 60 52 74" strokeLinecap="round" fill="none" />
            <line x1="50" x2="50" y1="20" y2="78" strokeLinecap="round" fill="none" />
          </>
        );

      case 'magnifier':
        return (
          <>
            <circle cx="42" cy="40" r="24" strokeLinejoin="round" />
            <circle cx="42" cy="40" r="20" strokeLinejoin="round" fill="none" />
            <path d="M 30 28 C 36 24 48 24 54 28" strokeLinecap="round" fill="none" />
            <rect x="58" y="56" width="30" height="8" rx="3" transform="rotate(45 58 56)" strokeLinejoin="round" />
          </>
        );

      default:
        // Graceful fallback to Kaolin Vase
        return (
          <path
            d="M 44 26 L 56 26 L 54 36 C 66 44 68 62 60 76 L 40 76 C 32 62 34 44 46 36 Z"
            strokeLinejoin="round"
          />
        );
    }
  };

  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      style={svgStyle}
      aria-label={`${name} Illustration`}
    >
      {renderSvg()}
    </svg>
  );
};
