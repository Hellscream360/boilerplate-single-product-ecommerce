# 🛒 Monoproduct E-commerce Boilerplate (Nuxt 3 + Strapi + Stripe)

A minimal and developer-friendly boilerplate for selling **a single product online**, with a fully manageable back-office and Stripe integration.

---

## ⚙️ Tech Stack

- 🎨 **Frontend**: [Nuxt 3](https://nuxt.com) + [Tailwind CSS](https://tailwindcss.com)
- 🧠 **Backend**: [Strapi CMS](https://strapi.io) (Node.js, Headless)
- 💳 **Payments**: [Stripe Checkout](https://stripe.com/docs/checkout)

---

## ✨ Features

- 🛍️ One product, fully configurable via Strapi admin
- 📦 Order history stored in Strapi
- 💳 Stripe payment integration (Checkout)
- 🔐 Secure admin panel with Strapi authentication
- 🌍 Internationalization support (English and French)
- ⚙️ Developer-friendly and easy to deploy

---

## 📁 Project Structure

```bash
monoproduct-ecommerce/
├── frontend/           # Nuxt 3 frontend
│   ├── i18n/          # Internationalization
│   │   └── locales/   # Translation files (en.json, fr.json)
├── backend/           # Strapi CMS backend
│   ├── src/
│   │   └── seeds/    # Seed data for initialization
├── .env.example       # Sample environment config
├── .gitignore
└── README.md
```

---

## 🚀 Quick Start

### 1. Clone the repository

```bash
git clone https://github.com/hellscream360/boilerplate-single-product-ecommerce.git
cd boilerplate-single-product-ecommerce
```

### 2. Install & run frontend

```bash
cd frontend
npm install
npm run dev
```

### 3. Install & run backend (Strapi)

```bash
cd backend
npm install
npm run develop
```

### 4. Initialize the database

After creating your admin account in Strapi:

```bash
cd backend
npm run strapi seed
```

This will create the product with all its translations.

---

## 📦 Product Structure

The Product Content Type is configured with:

### Main Fields (all translated except price and stock)
- `title`: Product title (text)
- `description`: Detailed description (long text)
- `price`: Price (decimal)
- `stock`: Available stock (integer)
- `features`: List of features (JSON)

### Internationalization
- All text fields are configured for translation (EN/FR)
- Price and stock are shared between translations
- Features are also translatable

The schema is pre-configured in:
- `backend/src/api/product/content-types/product/schema.json`

---

## 🚀 Strapi Setup

### 1. Initial Setup

```bash
# Install dependencies
cd backend
npm install

# Copy environment file
cp .env.example .env

# Configure environment variables in .env
```

### 2. First Launch

```bash
npm run develop
```

On first launch:
1. Strapi will ask you to create an admin account
2. Fill in the required information (email, password)
3. Log in to the admin interface

### 3. Content Type Configuration

The Product Content Type is automatically configured with:
- Title and description (translated)
- Price and stock
- Availability status
- Features in JSON (translated)
- Images

### 4. Internationalization Setup

1. In the Strapi admin interface:
   - Go to Settings > Internationalization
   - Verify that English (en) is the default language
   - Add French (fr) as an additional language

### 5. Data Initialization

```bash
npm run strapi seed
```

This command will:
- Create the product in English
- Create its French translation
- Link both versions together

### 6. Permissions Setup

1. In the Strapi admin interface:
   - Go to Settings > Roles
   - Select the "Public" role
   - In the Product section, enable these permissions:
     - find
     - findOne
   - Save changes

### 7. API Token Creation

1. In the Strapi admin interface:
   - Go to Settings > API Tokens
   - Click on "Create new API Token"
   - Name: "Frontend Read Access"
   - Type: "Read-only"
   - Copy the generated token
   - Paste it in the frontend's `.env` file:
     ```
     STRAPI_API_READ_ONLY=your-api-token
     ```

### 8. Verification

To verify everything is properly configured:
1. Strapi API should be accessible at `http://localhost:1337`
2. Product should be visible in the admin interface
3. Translations should be available in FR and EN
4. Public API requests should work

---

## Environment Variables

### Frontend (.env)
```
STRAPI_URL=http://localhost:1337
STRAPI_API_READ_ONLY=your-api-token
STRIPE_PUBLIC_KEY=your-stripe-public-key
```

### Backend (.env)
```
STRIPE_SECRET_KEY=your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=your-stripe-webhook-secret
```