export type CategoryType = 'ALL' | 'CLOTHING' | 'HOME GOODS' | 'ACCESSORIES';

export type BadgeVariant = 
  | 'bestseller' 
  | 'organic' 
  | 'popular' 
  | 'new' 
  | 'limited' 
  | 'eco' 
  | 'handmade' 
  | 'featured';

export interface ProductColor {
  name: string;
  hex: string;
}

export type ProductIllustrationName =
  // Apparel & Wearables (25)
  | 'tshirt'
  | 'hoodie'
  | 'jacket'
  | 'sweater'
  | 'coat'
  | 'pants'
  | 'shorts'
  | 'dress'
  | 'kimono'
  | 'vest'
  | 'hat'
  | 'cap'
  | 'beanie'
  | 'scarf'
  | 'socks'
  | 'blazer'
  | 'cardigan'
  | 'turtleneck'
  | 'tanktop'
  | 'skirt'
  | 'overalls'
  | 'gloves'
  | 'apron'
  | 'belt-buckle'
  | 'raincoat'
  // Footwear & Carry (20)
  | 'sneakers'
  | 'boots'
  | 'sandals'
  | 'loafers'
  | 'slippers'
  | 'backpack'
  | 'totebag'
  | 'duffle'
  | 'wallet'
  | 'pouch'
  | 'belt'
  | 'umbrella'
  | 'clogs'
  | 'derby'
  | 'chelsea-boot'
  | 'messenger-bag'
  | 'clutch'
  | 'fanny-pack'
  | 'luggage'
  | 'cardholder'
  // Ceramics, Kitchen & Dining (25)
  | 'mug'
  | 'cup'
  | 'teapot'
  | 'kettle'
  | 'vase'
  | 'bowl'
  | 'plate'
  | 'pitcher'
  | 'bottle'
  | 'coffee-press'
  | 'cutlery'
  | 'tray'
  | 'matcha-whisk'
  | 'matcha-bowl'
  | 'pour-over'
  | 'mortar-pestle'
  | 'chopsticks'
  | 'serving-board'
  | 'carafe'
  | 'salt-pepper'
  | 'wine-goblet'
  | 'espresso-cup'
  | 'sauce-dish'
  | 'jar'
  | 'cooking-pot'
  // Home Living & Studio (25)
  | 'plant'
  | 'flower'
  | 'lamp'
  | 'lantern'
  | 'candle'
  | 'cushion'
  | 'blanket'
  | 'chair'
  | 'stool'
  | 'mirror'
  | 'clock'
  | 'basket'
  | 'notebook'
  | 'diffuser'
  | 'towel'
  | 'bonsai'
  | 'desk'
  | 'shelf'
  | 'bench'
  | 'rug'
  | 'floor-lamp'
  | 'incense'
  | 'watering-can'
  | 'curtain'
  | 'coat-rack'
  // Tech, Sound, Wellness & Personal (20)
  | 'headphones'
  | 'earbuds'
  | 'watch'
  | 'sunglasses'
  | 'glasses'
  | 'pen'
  | 'laptop'
  | 'camera'
  | 'speaker'
  | 'phone'
  | 'turntable'
  | 'radio'
  | 'soap'
  | 'perfume'
  | 'comb'
  | 'scissor'
  | 'keychain'
  | 'pocket-knife'
  | 'journal-pen'
  | 'magnifier'
  | (string & {});

export interface Product {
  id: string;
  name: string;
  category: 'CLOTHING' | 'HOME GOODS' | 'ACCESSORIES';
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  badge?: {
    text: string;
    variant: BadgeVariant;
  };
  colors: ProductColor[];
  sizes: string[];
  description: string;
  details: string[];
  inStock: boolean;
  stockQuantity?: number;
  illustration: ProductIllustrationName;
  imageUrl?: string;
}

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  selectedColor: ProductColor;
  selectedSize: string;
  quantity: number;
  category: string;
  illustration: Product['illustration'];
  imageUrl?: string;
}

export interface FilterState {
  selectedCategory: CategoryType;
  priceRange: [number, number];
  selectedColor: string | null;
  selectedSize: string | null;
  inStockOnly: boolean;
  sortBy: 'newest' | 'price-asc' | 'price-desc' | 'rating';
  viewMode: 'grid' | 'list';
  searchQuery: string;
}

export interface ProductReview {
  id: string;
  productId: string;
  author: string;
  userName?: string;
  userEmail?: string;
  location?: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  verified: boolean;
  verifiedBuyer?: boolean;
  recommendProduct?: boolean;
  helpfulCount?: number;
  adminReply?: {
    text: string;
    date: string;
    author: string;
  };
}
