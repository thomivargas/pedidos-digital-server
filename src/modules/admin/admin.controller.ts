import { asyncHandler } from '@utils/asyncHandler';
import * as adminService from './admin.service';
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
import type { PaginationParams } from '@utils/pagination';

export const listarTodosPedidosHandler = asyncHandler(async (req, res) => {
  const result = await adminService.listarTodosPedidos(
    req.query as unknown as AdminPedidosQuery,
  );
  res.json({ status: 'ok', ...result });
});

export const listarVendedoresHandler = asyncHandler(async (req, res) => {
  const result = await adminService.listarVendedores(req.query as unknown as AdminVendedoresQuery);
  res.json({ status: 'ok', ...result });
});

export const listarSucursalesHandler = asyncHandler(async (req, res) => {
  const result = await adminService.listarSucursales(req.query as unknown as PaginationParams);
  res.json({ status: 'ok', ...result });
});

export const crearSucursalHandler = asyncHandler(async (req, res) => {
  const sucursal = await adminService.crearSucursal(req.body as CrearSucursalDto);
  res.status(201).json({ status: 'ok', data: sucursal });
});

export const asignarVendedoresHandler = asyncHandler(async (req, res) => {
  const sucursal = await adminService.asignarVendedores(
    String(req.params.id),
    req.body as AsignarVendedoresDto,
  );
  res.json({ status: 'ok', data: sucursal });
});

export const crearUsuarioHandler = asyncHandler(async (req, res) => {
  const usuario = await adminService.crearUsuario(req.body as CrearUsuarioDto);
  res.status(201).json({ status: 'ok', data: usuario });
});

export const completarPedidoHandler = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const pedido = await adminService.completarPedido(String(id));
  res.json({ status: 'ok', data: pedido });
});

// ─── Permutas ─────────────────────────────────────────────────────────────

export const listarPermutasHandler = asyncHandler(async (req, res) => {
  const result = await adminService.listarPermutas(req.query as unknown as PaginationParams);
  res.json({ status: 'ok', ...result });
});

export const crearPermutaHandler = asyncHandler(async (req, res) => {
  const permuta = await adminService.crearPermuta(req.body as CrearPermutaAdminDto);
  res.status(201).json({ status: 'ok', data: permuta });
});

export const editarPermutaHandler = asyncHandler(async (req, res) => {
  const permuta = await adminService.editarPermuta(
    String(req.params.id),
    req.body as EditarPermutaAdminDto,
  );
  res.json({ status: 'ok', data: permuta });
});

export const desactivarPermutaHandler = asyncHandler(async (req, res) => {
  await adminService.desactivarPermuta(String(req.params.id));
  res.json({ status: 'ok', message: 'Permuta desactivada' });
});

// ─── Planes de Pago ───────────────────────────────────────────────────────

export const listarPlanesPagoHandler = asyncHandler(async (req, res) => {
  const result = await adminService.listarPlanesPago(req.query as unknown as PaginationParams);
  res.json({ status: 'ok', ...result });
});

export const crearPlanPagoHandler = asyncHandler(async (req, res) => {
  const plan = await adminService.crearPlanPago(req.body as CrearPlanPagoAdminDto);
  res.status(201).json({ status: 'ok', data: plan });
});

export const editarPlanPagoHandler = asyncHandler(async (req, res) => {
  const plan = await adminService.editarPlanPago(
    String(req.params.id),
    req.body as EditarPlanPagoAdminDto,
  );
  res.json({ status: 'ok', data: plan });
});

export const desactivarPlanPagoHandler = asyncHandler(async (req, res) => {
  await adminService.desactivarPlanPago(String(req.params.id));
  res.json({ status: 'ok', message: 'Plan de pago desactivado' });
});
