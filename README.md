# Ecommerce API (Node.js + TypeScript)

REST API for users, categories, products, and orders.

## Tech Stack

- Node.js + Express 5
- TypeScript
- MongoDB + Mongoose
- Zod (request validation)
- Swagger UI + OpenAPI docs

## Quick Start

1. Install dependencies:

```bash
npm install
```

2. Create a .env file in the project root:

```env
MONGO_URI=mongodb://localhost:27017
```

3. Run in development:

```bash
npm run dev
```

Server runs on http://localhost:3000.

## Scripts

- npm run dev: Run with watch mode using source files.
- npm run build: Compile TypeScript into dist.
- npm run start: Build and run compiled app.

## API Routes

- /users
- /categories
- /products
- /orders

Each resource supports standard CRUD operations.

## API Documentation

- Swagger UI: http://localhost:3000/docs
- OpenAPI JSON: http://localhost:3000/docs/openapi.json

## Project Structure

```text
src/
	app.ts
	controllers/
	db/
	middleware/
	models/
	routes/
	schemas/
	utils/
```

## Notes

- The app expects MONGO_URI to be set.
- Validation uses Zod schemas in src/schemas.
- Dist output is generated only after build.
