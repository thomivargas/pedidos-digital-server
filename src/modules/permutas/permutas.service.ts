import { prisma } from '../../config/database';
import { NotFoundError } from '../../middlewares/errors';
import {
  getPaginationArgs,
  buildPaginatedResult,
  type PaginationParams,
} from '../../utils/pagination';
import type { CrearPermutaDto, EditarPermutaDto } from './permutas.schema';

export async function listarPermutas(params: PaginationParams) {
  const { skip, take } = getPaginationArgs(params);

  const where = { activo: true };

  const [data, total] = await Promise.all([
    prisma.celularPermuta.findMany({
      where,
      skip,
      take,
      orderBy: [{ nombre: 'asc' }, { bateriaMin: 'asc' }],
    }),
    prisma.celularPermuta.count({ where }),
  ]);

  return buildPaginatedResult(data, total, params);
}

export async function crearPermuta(dto: CrearPermutaDto) {
  return prisma.celularPermuta.create({ data: dto });
}

export async function editarPermuta(id: string, dto: EditarPermutaDto) {
  const existe = await prisma.celularPermuta.findUnique({ where: { id } });
  if (!existe) throw new NotFoundError('Permuta no encontrada');

  return prisma.celularPermuta.update({ where: { id }, data: dto });
}

export async function desactivarPermuta(id: string) {
  const existe = await prisma.celularPermuta.findUnique({ where: { id } });
  if (!existe) throw new NotFoundError('Permuta no encontrada');

  return prisma.celularPermuta.update({
    where: { id },
    data: { activo: false },
  });
}
