# ⚡ STRATEGY Sports & Academy

A modern, high-performance web platform combining a **multi-discipline sports training academy** (Roller Skating & Basketball) with a **premium sports gear & apparel e-commerce store**.

---

## 🌟 Platform Highlights

### 1. 🛼 UAE Skating Angels — Skating Academy
- **10-Level Progressive Training Program** for kids, teens, and adults.
- **Trial Class Booking (30 AED)** with automated date/time calendar slot picker.
- **Certified Coaching Staff Showcase** featuring head coaches, specialized skill trainers, and interactive mentorship details.
- **State-of-the-Art Arena & Facility Gallery** with interactive lightbox preview and lounge details (Al Nahiyan, Abu Dhabi).

### 2. 🏀 STRATEGY Basketball Academy
- **FIBA-Certified Coaching Clinics**:
  - Coach Alex (Elite Shooting & Skills Clinic)
  - Coach David (Defense & Tactical Play Lab)
  - Coach Marcus (1-on-1 Mentorship & League Prep)
- **Computer Vision & AI Shooting Lab Showcase** and High-Performance Training Court details.
- **Interactive Trial Booking & Gamified Reward System** with custom digital scratch cards.

### 3. 🛍️ STRATEGY Sports Pro Shop (E-Commerce)
- **Multi-Category Catalog**: Basketball, Skating (Quad & Inline), Football, Running, Tennis, Cricket, and Training apparel.
- **Collectors Vault / Special Edition Drops** with limited-run gear.
- **Luxury White & Blue Cart Drawer** with real-time subtotal calculation, free shipping progress bar, promo code engine, and express checkout.
- **Interactive Wishlist System** with persistent local storage and one-click add to cart.
- **Quick View / Product Detail Modal** with high-resolution image zoom, size guide modal, and installment breakdown.

### 4. 📜 Policy & Support Infrastructure
- **Returns & Refunds Policy** (Strict 3-Day return window for unused items with tags).
- **Terms & Conditions** and **Privacy Policy**.
- **Shipping Policy & Delivery Estimates**.
- **Interactive FAQs & Support Contact Form**.

---

## 🛠️ Technology Stack

- **Frontend Framework**: [React 19](https://react.dev/) + [Vite](https://vite.dev/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Effects & Gamification**: Canvas Confetti
- **Styling**: Vanilla CSS3 + Modern Custom Design System (Glassmorphism, Tailwind utility integration, dynamic responsive grids)
- **Fonts**: Plus Jakarta Sans, Outfit, Oswald, Caveat, Space Grotesk

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/ansuiii/strategy-academy.git

# Navigate into the project folder
cd strategy-academy

# Install dependencies
npm install

# Start the local development server
npm run dev
```

The application will be running live at `http://localhost:5173`.

### Production Build
```bash
# Build the optimized production bundle
npm run build

# Preview the production build locally
npm run preview
```

---

## 📁 Project Structure

```text
├── public/
│   ├── images/
│   │   ├── coaches/           # Coach portraits in official STRATEGY uniforms
│   │   ├── skating_angels/    # UAE Skating Angels arena & class photos
│   │   └── ...                # Product & banner assets
├── src/
│   ├── components/
│   │   ├── StrategySportsHome.jsx    # Pro Shop E-commerce Homepage
│   │   ├── AboutSection.jsx          # UAE Skating Angels Academy
│   │   ├── BasketballSection.jsx     # Basketball Academy & Coaches
│   │   ├── HomeSection.jsx           # Master Portal & Gateway
│   │   ├── CartDrawer.jsx            # Sliding White & Blue Cart
│   │   ├── WishlistDrawer.jsx        # Saved Items Drawer
│   │   ├── QuickViewModal.jsx        # Product Quick View Modal
│   │   ├── AppointmentCalendar.jsx   # Custom Date/Slot Picker
│   │   ├── ProductCard.jsx           # Reusable E-Commerce Card
│   │   ├── SpecialEdition.jsx        # Limited Quantity Vault
│   │   └── ... (Policy Pages & Modals)
│   ├── data/
│   │   ├── products.js               # Sports Catalog Data
│   │   ├── programs.js               # Skating Training Levels
│   │   ├── coaches.js                # Coach Profiles
│   │   └── faqs.js                   # FAQ Knowledge Base
│   ├── App.jsx                       # Client-Side Tab & Hash Router
│   ├── index.css                     # Global Design Tokens & Responsive Grid
│   └── main.jsx                      # App Root
└── package.json
```

---

## 📄 License
© STRATEGY Sports & UAE Skating Angels. All rights reserved.
