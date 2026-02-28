import { Router } from 'express';
import { authenticate } from '../../middlewares/auth.middleware';
import { requireRole } from '../../middlewares/rol.middleware';
import { validate } from '../../middlewares/validate.middleware';
import { paginationSchema } from '../../utils/pagination';
import { listarPermutasHandler } from './permutas.controller';

const router = Router();

// GET /permutas — accesible para VENDEDOR y ADMIN (autenticado)
router.use(authenticate);
router.get('/', validate(paginationSchema, 'query'), listarPermutasHandler);

export default router;
