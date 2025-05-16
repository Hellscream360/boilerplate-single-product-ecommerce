# Nuxt Minimal Starter

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Internationalization (i18n)

The application supports multiple languages with [Nuxt i18n](https://i18n.nuxtjs.org/). Currently supported languages:

- English (default)
- French

### Structure

Translation files are located in the `i18n/locales` directory:
```bash
i18n/
└── locales/
    ├── en.json    # English translations
    └── fr.json    # French translations
```

### URL Strategy

The application uses the `prefix_except_default` strategy:
- English (default): `/product`
- French: `/fr/product`

### Adding New Translations

1. Add your translation key in both `en.json` and `fr.json`
2. Use the translation in your components with the `t()` function:
```vue
<template>
  <div>{{ t('your.translation.key') }}</div>
</template>
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
