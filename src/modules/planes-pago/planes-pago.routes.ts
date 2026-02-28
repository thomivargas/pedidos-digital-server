import { Router } from 'express';
import { authenticate } from '../../middlewares/auth.middleware';
import { validate } from '../../middlewares/validate.middleware';
import { paginationSchema } from '../../utils/pagination';
import { listarPlanesPagoHandler } from './planes-pago.controller';

const router = Router();

// GET /planes-pago — accesible para VENDEDOR y ADMIN (autenticado)
router.use(authenticate);
router.get('/', validate(paginationSchema, 'query'), listarPlanesPagoHandler);

export default router;
