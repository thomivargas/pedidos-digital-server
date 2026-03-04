import { asyncHandler } from '@utils/asyncHandler';
import * as planesPagoService from './planes-pago.service';
import type { CrearPlanPagoDto, EditarPlanPagoDto } from './planes-pago.schema';
import type { PaginationParams } from '@utils/pagination';

export const listarPlanesPagoHandler = asyncHandler(async (req, res) => {
  const result = await planesPagoService.listarPlanesPago(
    req.query as unknown as PaginationParams,
  );
  res.json({ status: 'ok', ...result });
});

export const crearPlanPagoHandler = asyncHandler(async (req, res) => {
  const plan = await planesPagoService.crearPlanPago(req.body as CrearPlanPagoDto);
  res.status(201).json({ status: 'ok', data: plan });
});

export const editarPlanPagoHandler = asyncHandler(async (req, res) => {
  const plan = await planesPagoService.editarPlanPago(
    String(req.params.id),
    req.body as EditarPlanPagoDto,
  );
  res.json({ status: 'ok', data: plan });
});

export const desactivarPlanPagoHandler = asyncHandler(async (req, res) => {
  await planesPagoService.desactivarPlanPago(String(req.params.id));
  res.json({ status: 'ok', message: 'Plan de pago desactivado' });
});
