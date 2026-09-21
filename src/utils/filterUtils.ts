import { Product, CategoryType } from '@/types';

export interface ColorPaletteItem {
  id: string;
  name: string;
  hex: string;
  isLight?: boolean;
  keywords: string[];
}

/**
 * 6 curated slow-living aesthetic color families defining E Sondha's Japanese/Scandinavian collection.
 */
export const CURATED_COLOR_PALETTES: ColorPaletteItem[] = [
  {
    id: 'cream',
    name: 'Natural & Cream',
    hex: '#f4ede4',
    isLight: true,
    keywords: ['cream', 'bone', 'white', 'sand', 'flax', 'oatmeal', 'chalk'],
  },
  {
    id: 'black',
    name: 'Charcoal & Black',
    hex: '#2a2a2a',
    isLight: false,
    keywords: ['charcoal', 'black', 'iron', 'dark'],
  },
  {
    id: 'blue',
    name: 'Slate & Indigo',
    hex: '#25435a',
    isLight: false,
    keywords: ['slate blue', 'indigo', 'navy', 'blue'],
  },
  {
    id: 'terracotta',
    name: 'Warm Terracotta',
    hex: '#ba674d',
    isLight: false,
    keywords: ['terracotta', 'pot', 'blush', 'brass', 'rust', 'clay'],
  },
  {
    id: 'olive',
    name: 'Forest & Sage',
    hex: '#59634d',
    isLight: false,
    keywords: ['olive', 'moss', 'sage', 'forest', 'green'],
  },
  {
    id: 'gray',
    name: 'Mineral Slate',
    hex: '#476274',
    isLight: false,
    keywords: ['slate gray', 'slate', 'steel', 'khaki', 'gray', 'grey'],
  },
];

/**
 * Checks whether a product matches a selected color filter.
 * Supports both curated palette family matching and exact custom color names.
 */
export function productMatchesColor(
  product: Pick<Product, 'colors'>,
  selectedColor: string | null
): boolean {
  if (!selectedColor) return true;
  if (!product.colors || product.colors.length === 0) return false;

  const palette = CURATED_COLOR_PALETTES.find(
    (p) =>
      p.name.toLowerCase() === selectedColor.toLowerCase() ||
      p.id.toLowerCase() === selectedColor.toLowerCase()
  );

  if (palette) {
    return product.colors.some((c) => {
      const name = c.name.toLowerCase();
      const matchesKeyword = palette.keywords.some((kw) => name.includes(kw));
      const matchesHex = c.hex ? c.hex.toLowerCase() === palette.hex.toLowerCase() : false;
      return matchesKeyword || matchesHex;
    });
  }

  // Fallback for custom artisan color names added in Admin
  const target = selectedColor.toLowerCase();
  return product.colors.some((c) => {
    const cName = c.name.toLowerCase();
    return cName.includes(target) || target.includes(cName) || (c.hex && c.hex.toLowerCase() === target);
  });
}

export type SizeGroup = 'apparel' | 'shoes' | 'dimensions';

const APPAREL_ORDER = ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', '2XL', '3XL'];

/**
 * Automatically categorizes a raw size string into Apparel, Footwear, or Dimensions.
 */
export function categorizeSize(size: string): SizeGroup {
  const s = size.trim().toLowerCase();
  // Two-digit shoe sizing (e.g. 38, 39, 40, 41, 42, 43, 44, 45, 46)
  if (/^\d{2}$/.test(s)) {
    return 'shoes';
  }
  // Standard alpha apparel sizing
  if (/^(xxs|xs|s|m|l|xl|xxl|2xl|3xl)$/i.test(s)) {
    return 'apparel';
  }
  return 'dimensions';
}

/**
 * Sorts sizes in logical order:
 * - Apparel: XXS -> XS -> S -> M -> L -> XL -> XXL
 * - Shoes: 39 -> 40 -> 41 -> 42 -> 43 -> 44
 * - Dimensions: natural alphabetical/numeric
 */
export function sortSizes(sizes: string[], group: SizeGroup): string[] {
  if (group === 'apparel') {
    return [...sizes].sort((a, b) => {
      const idxA = APPAREL_ORDER.indexOf(a.toUpperCase());
      const idxB = APPAREL_ORDER.indexOf(b.toUpperCase());
      if (idxA !== -1 && idxB !== -1) return idxA - idxB;
      if (idxA !== -1) return -1;
      if (idxB !== -1) return 1;
      return a.localeCompare(b);
    });
  }
  if (group === 'shoes') {
    return [...sizes].sort((a, b) => {
      const numA = parseInt(a, 10);
      const numB = parseInt(b, 10);
      if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
      return a.localeCompare(b);
    });
  }
  return [...sizes].sort((a, b) => a.localeCompare(b));
}

/**
 * Groups unique sizes for a specific product category into apparel, shoes, and dimensions.
 */
export function getAvailableSizesForCategory(
  products: Product[],
  category: CategoryType
): {
  apparel: string[];
  shoes: string[];
  dimensions: string[];
} {
  const relevantProducts =
    category === 'ALL' ? products : products.filter((p) => p.category === category);

  const apparelSet = new Set<string>();
  const shoesSet = new Set<string>();
  const dimensionsSet = new Set<string>();

  relevantProducts.forEach((p) => {
    p.sizes?.forEach((raw) => {
      const s = raw?.trim();
      if (!s) return;
      const group = categorizeSize(s);
      if (group === 'apparel') apparelSet.add(s);
      else if (group === 'shoes') shoesSet.add(s);
      else dimensionsSet.add(s);
    });
  });

  return {
    apparel: sortSizes(Array.from(apparelSet), 'apparel'),
    shoes: sortSizes(Array.from(shoesSet), 'shoes'),
    dimensions: sortSizes(Array.from(dimensionsSet), 'dimensions'),
  };
}
