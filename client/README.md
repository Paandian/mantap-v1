# Mantap.work Client

This is the Vue 3 frontend for Mantap.work.

## Project Setup

```sh
npm install
```

### Compiles and Hot-Reloads for Development

```sh
npm run dev
```

### Compiles and Minifies for Production

```sh
npm run build
```

### Lints and Fixes Files

```sh
npm run lint
```

## Configuration

The API base URL can be configured in `vite.config.js` or via `.env` files.
Default: `http://localhost:5000`

## Structure

- `/src/views`: Top-level pages (Home, Login, Admin)
- `/src/components`: Reusable UI components
- `/src/stores`: Pinia state management (Auth)
- `/src/services`: Axios API client
- `/public/assets`: Static images and resources
