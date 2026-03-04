import express from 'express';
import compression from 'compression';
import cors from 'cors';
import helmet from 'helmet';
import pinoHttp from 'pino-http';

import { env } from './config/env';
import { logger } from './config/logger';
import { errorHandler } from './middlewares/error.middleware';
import { authLimiter, apiLimiter } from './middlewares/rate-limit.middleware';
import authRoutes from './modules/auth/auth.routes';
import pedidosRoutes from './modules/pedidos/pedidos.routes';
import adminRoutes from './modules/admin/admin.routes';
import permutasRoutes from './modules/permutas/permutas.routes';
import planesPagoRoutes from './modules/planes-pago/planes-pago.routes';

const app = express();

// ─── Middlewares globales ─────────────────────────────────────────────────────
app.use(compression());
app.use(helmet());

// CORS — soporta múltiples orígenes separados por coma en CORS_ORIGIN
const allowedOrigins = env.CORS_ORIGIN.split(',').map((o) => o.trim());
app.use(
  cors({
    origin: allowedOrigins.length === 1 ? allowedOrigins[0] : allowedOrigins,
    credentials: true,
  }),
);

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Rate limiting global
app.use(apiLimiter);

// HTTP request logging (todos los ambientes)
app.use(pinoHttp({ logger }));

// ─── Health check ─────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', env: env.NODE_ENV, timestamp: new Date().toISOString() });
});

// ─── Rutas ──────────────────────────────────────────────────────────
const API_PREFIX = '/api';

app.use(`${API_PREFIX}/auth`, authLimiter, authRoutes);
app.use(`${API_PREFIX}/pedidos`, pedidosRoutes);
app.use(`${API_PREFIX}/admin`, adminRoutes);
app.use(`${API_PREFIX}/permutas`, permutasRoutes);
app.use(`${API_PREFIX}/planes-pago`, planesPagoRoutes);

// ─── 404 handler ─────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ status: 'error', message: 'Ruta no encontrada' });
});

// ─── Error handler global (debe ser el último) ────────────────────────────────
app.use(errorHandler);

export default app;
