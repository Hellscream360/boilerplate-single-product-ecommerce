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
- ⚙️ Developer-friendly and easy to deploy

---

## 📁 Project Structure

```bash
monoproduct-ecommerce/
├── frontend/       # Nuxt 3 frontend
├── backend/        # Strapi CMS backend
├── .env.example    # Sample environment config
├── .gitignore
└── README.md
```

---

## 🚀 Quick Start

### 1. Clone the repository

```bash
git clone https://github.com/your-username/monoproduct-ecommerce.git
cd monoproduct-ecommerce
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