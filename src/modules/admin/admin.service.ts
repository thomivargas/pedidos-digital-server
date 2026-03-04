import { prisma } from '../../config/database';
import { NotFoundError, BadRequestError, ConflictError } from '../../middlewares/errors';
import { registrarCambioEstado } from '../../utils/audit';
import { hashPassword } from '../../utils/hash';
import {
  getPaginationArgs,
  buildPaginatedResult,
  type PaginationParams,
} from '../../utils/pagination';
import type {
  AdminPedidosQuery,
  AdminVendedoresQuery,
  CrearUsuarioDto,
  CrearSucursalDto,
  AsignarVendedoresDto,
  CrearPermutaAdminDto,
  EditarPermutaAdminDto,
  CrearPlanPagoAdminDto,
  EditarPlanPagoAdminDto,
} from './admin.schema';

export async function listarTodosPedidos(params: AdminPedidosQuery) {
  const { skip, take } = getPaginationArgs(params);

  const where = {
    ...(params.estado && { estado: params.estado }),
    ...(params.vendedorId && { vendedorId: params.vendedorId }),
  };

  const [data, total] = await Promise.all([
    prisma.pedido.findMany({
      where,
      skip,
      take,
      orderBy: { creadoEn: 'desc' },
      include: {
        vendedor: { select: { id: true, nombre: true, correo: true } },
        planPago: true,
      },
    }),
    prisma.pedido.count({ where }),
  ]);

  return buildPaginatedResult(data, total, params);
}

export async function listarVendedores(params: AdminVendedoresQuery) {
  const { skip, take } = getPaginationArgs(params);

  const sucursalFilter =
    params.sucursalId === 'none'
      ? { sucursalId: null }
      : params.sucursalId
        ? { sucursalId: params.sucursalId }
        : {};

  const where = { rol: 'VENDEDOR' as const, ...sucursalFilter };

  const [data, total] = await Promise.all([
    prisma.usuario.findMany({
      where,
      skip,
      take,
      orderBy: { nombre: 'asc' },
      select: {
        id: true,
        nombre: true,
        correo: true,
        rol: true,
        creadoEn: true,
        sucursalId: true,
        sucursal: { select: { id: true, nombre: true } },
        _count: { select: { pedidos: true } },
      },
    }),
    prisma.usuario.count({ where }),
  ]);

  return buildPaginatedResult(data, total, params);
}

export async function listarSucursales(params: PaginationParams) {
  const { skip, take } = getPaginationArgs(params);

  const [data, total] = await Promise.all([
    prisma.sucursal.findMany({
      skip,
      take,
      orderBy: { nombre: 'asc' },
      include: {
        _count: { select: { vendedores: true } },
        vendedores: { select: { id: true } },
      },
    }),
    prisma.sucursal.count(),
  ]);

  return buildPaginatedResult(data, total, params);
}

export async function crearSucursal(dto: CrearSucursalDto) {
  return prisma.sucursal.create({
    data: dto,
    select: { id: true, nombre: true, direccion: true, creadoEn: true },
  });
}

export async function asignarVendedores(sucursalId: string, dto: AsignarVendedoresDto) {
  const sucursal = await prisma.sucursal.findUnique({ where: { id: sucursalId } });
  if (!sucursal) throw new NotFoundError('Sucursal no encontrada');

  await prisma.$transaction(async (tx) => {
    // Desasignar todos los vendedores actuales de esta sucursal
    await tx.usuario.updateMany({
      where: { sucursalId },
      data: { sucursalId: null },
    });
    // Asignar los nuevos
    if (dto.vendedorIds.length > 0) {
      await tx.usuario.updateMany({
        where: { id: { in: dto.vendedorIds } },
        data: { sucursalId },
      });
    }
  });

  return prisma.sucursal.findUnique({
    where: { id: sucursalId },
    include: {
      _count: { select: { vendedores: true } },
      vendedores: { select: { id: true } },
    },
  });
}

export async function crearUsuario(dto: CrearUsuarioDto) {
  const existe = await prisma.usuario.findUnique({ where: { correo: dto.correo } });
  if (existe) throw new ConflictError('Ya existe un usuario con ese correo');

  const contrasena = await hashPassword(dto.contrasena);

  const usuario = await prisma.usuario.create({
    data: { nombre: dto.nombre, usuario: dto.usuario, correo: dto.correo, contrasena, rol: dto.rol },
    select: { id: true, nombre: true, correo: true, rol: true, creadoEn: true },
  });

  return usuario;
}

export async function completarPedido(pedidoId: string) {
  const pedido = await prisma.pedido.findUnique({ where: { id: pedidoId } });

  if (!pedido) throw new NotFoundError('Pedido no encontrado');
  if (pedido.estado !== 'ENVIADO_A_CAJA')
    throw new BadRequestError(
      `Solo se pueden completar pedidos en estado ENVIADO_A_CAJA. Estado actual: ${pedido.estado}`,
    );

  const pedidoActualizado = await prisma.pedido.update({
    where: { id: pedidoId },
    data: { estado: 'COMPLETADO' },
  });

  await registrarCambioEstado({
    entidadId: pedidoId,
    antes: 'ENVIADO_A_CAJA',
    despues: 'COMPLETADO',
  });

  return pedidoActualizado;
}

// ─── Permutas (catálogo) ──────────────────────────────────────────────────

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

export async function crearPermuta(dto: CrearPermutaAdminDto) {
  return prisma.celularPermuta.create({ data: dto });
}

export async function editarPermuta(id: string, dto: EditarPermutaAdminDto) {
  const existe = await prisma.celularPermuta.findUnique({ where: { id } });
  if (!existe) throw new NotFoundError('Permuta no encontrada');
  return prisma.celularPermuta.update({ where: { id }, data: dto });
}

export async function desactivarPermuta(id: string) {
  const existe = await prisma.celularPermuta.findUnique({ where: { id } });
  if (!existe) throw new NotFoundError('Permuta no encontrada');
  return prisma.celularPermuta.update({ where: { id }, data: { activo: false } });
}

// ─── Planes de Pago ───────────────────────────────────────────────────────

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

export async function crearPlanPago(dto: CrearPlanPagoAdminDto) {
  return prisma.planPago.create({ data: dto });
}

export async function editarPlanPago(id: string, dto: EditarPlanPagoAdminDto) {
  const existe = await prisma.planPago.findUnique({ where: { id } });
  if (!existe) throw new NotFoundError('Plan de pago no encontrado');
  return prisma.planPago.update({ where: { id }, data: dto });
}

export async function desactivarPlanPago(id: string) {
  const existe = await prisma.planPago.findUnique({ where: { id } });
  if (!existe) throw new NotFoundError('Plan de pago no encontrado');
  return prisma.planPago.update({ where: { id }, data: { activo: false } });
}
