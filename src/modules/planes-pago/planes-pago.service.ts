import { prisma } from '../../config/database';
import { NotFoundError } from '../../middlewares/errors';
import {
  getPaginationArgs,
  buildPaginatedResult,
  type PaginationParams,
} from '../../utils/pagination';
import type { CrearPlanPagoDto, EditarPlanPagoDto } from './planes-pago.schema';

export async function listarPlanesPago(params: PaginationParams) {
  const { skip, take } = getPaginationArgs(params);

  const where = { activo: true };

  const [data, total] = await Promise.all([
    prisma.planPago.findMany({
      where,
      skip,
      take,
      orderBy: [{ marca: 'asc' }, { cuotas: 'asc' }],
    }),
    prisma.planPago.count({ where }),
  ]);

  return buildPaginatedResult(data, total, params);
}

export async function crearPlanPago(dto: CrearPlanPagoDto) {
  return prisma.planPago.create({ data: dto });
}

export async function editarPlanPago(id: string, dto: EditarPlanPagoDto) {
  const existe = await prisma.planPago.findUnique({ where: { id } });
  if (!existe) throw new NotFoundError('Plan de pago no encontrado');

  return prisma.planPago.update({ where: { id }, data: dto });
}

export async function desactivarPlanPago(id: string) {
  const existe = await prisma.planPago.findUnique({ where: { id } });
  if (!existe) throw new NotFoundError('Plan de pago no encontrado');

  return prisma.planPago.update({
    where: { id },
    data: { activo: false },
  });
}
