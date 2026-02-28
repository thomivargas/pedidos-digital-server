import { Router } from 'express';
import { authenticate } from '../../middlewares/auth.middleware';
import { requireRole } from '../../middlewares/rol.middleware';
import { validate } from '../../middlewares/validate.middleware';
import { paginationSchema } from '../../utils/pagination';
import {
  adminPedidosQuerySchema,
  adminVendedoresQuerySchema,
  crearUsuarioSchema,
  crearSucursalSchema,
  asignarVendedoresSchema,
  crearPermutaAdminSchema,
  editarPermutaAdminSchema,
  crearPlanPagoAdminSchema,
  editarPlanPagoAdminSchema,
} from './admin.schema';
import {
  listarTodosPedidosHandler,
  listarVendedoresHandler,
  completarPedidoHandler,
  crearUsuarioHandler,
  listarSucursalesHandler,
  crearSucursalHandler,
  asignarVendedoresHandler,
  listarPermutasHandler,
  crearPermutaHandler,
  editarPermutaHandler,
  desactivarPermutaHandler,
  listarPlanesPagoHandler,
  crearPlanPagoHandler,
  editarPlanPagoHandler,
  desactivarPlanPagoHandler,
} from './admin.controller';

const router = Router();

// Todas las rutas requieren autenticación como ADMIN
router.use(authenticate, requireRole('ADMIN'));

router.get('/pedidos', validate(adminPedidosQuerySchema, 'query'), listarTodosPedidosHandler);
router.get('/vendedores', validate(adminVendedoresQuerySchema, 'query'), listarVendedoresHandler);
router.patch('/pedidos/:id/completar', completarPedidoHandler);
router.post('/usuarios', validate(crearUsuarioSchema), crearUsuarioHandler);

router.get('/sucursales', validate(adminVendedoresQuerySchema, 'query'), listarSucursalesHandler);
router.post('/sucursales', validate(crearSucursalSchema), crearSucursalHandler);
router.patch('/sucursales/:id/vendedores', validate(asignarVendedoresSchema), asignarVendedoresHandler);

// ─── Permutas ─────────────────────────────────────────────────────────────
router.get('/permutas', validate(paginationSchema, 'query'), listarPermutasHandler);
router.post('/permutas', validate(crearPermutaAdminSchema), crearPermutaHandler);
router.patch('/permutas/:id', validate(editarPermutaAdminSchema), editarPermutaHandler);
router.delete('/permutas/:id', desactivarPermutaHandler);

// ─── Planes de Pago ───────────────────────────────────────────────────────
router.get('/planes-pago', validate(paginationSchema, 'query'), listarPlanesPagoHandler);
router.post('/planes-pago', validate(crearPlanPagoAdminSchema), crearPlanPagoHandler);
router.patch('/planes-pago/:id', validate(editarPlanPagoAdminSchema), editarPlanPagoHandler);
router.delete('/planes-pago/:id', desactivarPlanPagoHandler);

export default router;
