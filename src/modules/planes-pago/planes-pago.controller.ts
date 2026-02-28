import { Request, Response, NextFunction } from 'express';
import * as planesPagoService from './planes-pago.service';
import type { CrearPlanPagoDto, EditarPlanPagoDto } from './planes-pago.schema';
import type { PaginationParams } from '../../utils/pagination';

export async function listarPlanesPagoHandler(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const result = await planesPagoService.listarPlanesPago(
      req.query as unknown as PaginationParams,
    );
    res.json({ status: 'ok', ...result });
  } catch (err) {
    next(err);
  }
}

export async function crearPlanPagoHandler(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const plan = await planesPagoService.crearPlanPago(req.body as CrearPlanPagoDto);
    res.status(201).json({ status: 'ok', data: plan });
  } catch (err) {
    next(err);
  }
}

export async function editarPlanPagoHandler(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const plan = await planesPagoService.editarPlanPago(
      String(req.params.id),
      req.body as EditarPlanPagoDto,
    );
    res.json({ status: 'ok', data: plan });
  } catch (err) {
    next(err);
  }
}

export async function desactivarPlanPagoHandler(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    await planesPagoService.desactivarPlanPago(String(req.params.id));
    res.json({ status: 'ok', message: 'Plan de pago desactivado' });
  } catch (err) {
    next(err);
  }
}
