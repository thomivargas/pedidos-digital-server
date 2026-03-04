# Pedidos Digital — Backend

API REST para gestión de pedidos de Digital Station.

## Stack

Node.js + Express + TypeScript + Prisma + PostgreSQL

## Prerequisitos

- Node.js >= 20
- PostgreSQL (o Supabase)

## Setup

```bash
npm install
cp .env.example .env   # configurar variables
npx prisma migrate dev
npm run db:seed         # datos iniciales
npm run dev
```

## Scripts

| Script | Descripción |
|--------|-------------|
| `npm run dev` | Servidor en modo desarrollo |
| `npm run build` | Compilar TypeScript |
| `npm start` | Ejecutar build compilado |
| `npm test` | Correr tests (Vitest) |
| `npm run db:migrate` | Ejecutar migraciones |
| `npm run db:seed` | Seed de datos iniciales |
| `npm run db:studio` | Abrir Prisma Studio |

## Variables de entorno

Ver `.env.example` para la lista completa.

## Deploy

Docker multistage en Render.com. Ver `Dockerfile` y `render.yaml`.
