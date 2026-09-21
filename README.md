# E Sondha — Slow-Living Atelier E-Commerce Platform

A minimalist, high-craft slow-living e-commerce experience designed with a quiet Japanese-Scandinavian aesthetic. Built with Next.js 14 App Router, TypeScript, and Tailwind CSS.

---

## Quick Start (Run from GitHub)

### Prerequisites
- **Node.js**: v18.17.0 or higher
- **npm**: v9 or higher

### 1. Clone the Repository
```bash
git clone https://github.com/kmsafinkamal/e-sondha.git
cd e-sondha
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to view the storefront.

### 4. Build for Production
```bash
npm run build
npm run start
```

---

## Core Features & Architecture

### 1. Storefront Experience
- **Quiet Minimalist Aesthetic**: Editorial typography, generous negative space, earth-tone slow-living palettes, and tactile micro-interactions.
- **Dynamic Capsule Lookbooks**: Triangular split transitions, pause-on-hover product selection, and customizable transition durations.
- **Curator's Choice Collection**: Editorial card highlights managed directly from the Admin control center.
- **Intelligent Related Product Lookbooks**: Auto-generated capsule lookbooks on the product detail page tailored to product archetype and tags.
- **Category Mega-Menu & Drawer**: Instant department filtering for Clothing, Ceramics & Living, and Accessories & Carry on both desktop and mobile.

### 2. 115+ Handcrafted Vector Line-Art Symbols
- **Pure SVG Line-Art Library**: Over 115 bespoke minimalist symbols across 5 curated categories:
  - **Apparel & Wearables (25)**: T-Shirt, Hoodie, Chore Jacket, Sweater, Coat, Trousers, Shorts, Dress, Kimono, Vest, Hat, Cap, Beanie, Scarf, Socks, Blazer, Cardigan, Turtleneck, Tank Top, Skirt, Overalls, Mittens, Apron, Belt Clasp, Storm Parka.
  - **Footwear & Bags (20)**: Court Sneakers, Chelsea Boots, Slide Sandals, Penny Loafers, Felt Slippers, Daypack, Market Tote, Travel Duffle, Bi-Fold Wallet, Zip Pouch, Leather Belt, Umbrella, Mule Clogs, Derby Shoes, Ankle Boots, Messenger Bag, Envelope Clutch, Sling Pack, Suitcase, Card Sleeve.
  - **Ceramics & Tableware (25)**: Mug, Tumbler, Kyusu Teapot, Gooseneck Kettle, Kaolin Vase, Stoneware Bowl, Plate, Pitcher, Bottle, French Press, Cutlery, Tray, Chasen Whisk, Chawan Bowl, Pour-Over, Mortar & Pestle, Chopsticks, Serving Board, Carafe, Seasoning Shakers, Stemmed Goblet, Demitasse Cup, Condiment Dish, Storage Jar, Donabe Pot.
  - **Home & Studio (25)**: Potted Plant, Botanical Stem, Desk Lamp, Washi Lantern, Pillar Candle, Floor Cushion, Blanket, Armchair, Stool, Mirror, Wall Clock, Basket, Journal, Diffuser, Towel, Bonsai Tree, Writing Desk, Floating Shelf, Entry Bench, Woven Rug, Floor Lamp, Incense Burner, Watering Can, Linen Drapes, Coat Tree.
  - **Tech, Wellness & Personal (20)**: Headphones, Earbuds, Watch, Sunglasses, Glasses, Pen, Laptop, Camera, Mesh Speaker, Phone, Turntable, Radio, Soap Bar, Fragrance Flacon, Comb, Craft Shears, Keychain, Pocket Knife, Sketchbook, Magnifying Glass.
- **100% Dynamic Color Adaptation**: All 115 symbols dynamically adapt their stroke, fill, and contrast luminance in real time based on the active product color variant.

### 3. Centralized Admin Studio Panel (`/admin`)
- **Executive Dashboard**: Key metrics, inventory alerts, and attention queue.
- **Catalog Management**: Add and edit products with live photo uploads, 115+ vector archetype picker with category tabs and search, and custom color palettes.
- **Capsule Lookbook Studio**: Create, edit, and assign lookbook capsules to Homepage or Shop catalog with transition speed control.
- **Curator's Choice Manager**: Add, reorder, and configure curator featured items and carousel animation timing.
- **Fulfillment & Orders**: Live order tracking and status management.
- **Patron Inquiries & Support**: Customer message manager with status filtering and curator replies.
- **VIP Subscriber Registry**: Newsletter subscriber registry with CSV export.
- **Store Settings**: Global announcement banner marquee, free shipping threshold, and studio contact details.

---

## Tech Stack
- **Framework**: [Next.js 14](https://nextjs.org/) (App Router, React Server Components & Client Components)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **State & Storage**: React Context API with persistent browser `localStorage` synchronization
