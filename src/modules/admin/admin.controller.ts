import { Request, Response, NextFunction } from 'express';
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
import type { PaginationParams } from '../../utils/pagination';

export async function listarTodosPedidosHandler(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const result = await adminService.listarTodosPedidos(
      req.query as unknown as AdminPedidosQuery,
    );
    res.json({ status: 'ok', ...result });
  } catch (err) {
    next(err);
  }
}

export async function listarVendedoresHandler(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const result = await adminService.listarVendedores(req.query as unknown as AdminVendedoresQuery);
    res.json({ status: 'ok', ...result });
  } catch (err) {
    next(err);
  }
}

export async function listarSucursalesHandler(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const result = await adminService.listarSucursales(req.query as unknown as PaginationParams);
    res.json({ status: 'ok', ...result });
  } catch (err) {
    next(err);
  }
}

export async function crearSucursalHandler(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const sucursal = await adminService.crearSucursal(req.body as CrearSucursalDto);
    res.status(201).json({ status: 'ok', data: sucursal });
  } catch (err) {
    next(err);
  }
}

export async function asignarVendedoresHandler(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const sucursal = await adminService.asignarVendedores(
      String(req.params.id),
      req.body as AsignarVendedoresDto,
    );
    res.json({ status: 'ok', data: sucursal });
  } catch (err) {
    next(err);
  }
}

export async function crearUsuarioHandler(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const usuario = await adminService.crearUsuario(req.body as CrearUsuarioDto);
    res.status(201).json({ status: 'ok', data: usuario });
  } catch (err) {
    next(err);
  }
}

export async function completarPedidoHandler(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { id } = req.params;
    const pedido = await adminService.completarPedido(String(id));
    res.json({ status: 'ok', data: pedido });
  } catch (err) {
    next(err);
  }
}

// ─── Permutas ─────────────────────────────────────────────────────────────

export async function listarPermutasHandler(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const result = await adminService.listarPermutas(req.query as unknown as PaginationParams);
    res.json({ status: 'ok', ...result });
  } catch (err) {
    next(err);
  }
}

export async function crearPermutaHandler(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const permuta = await adminService.crearPermuta(req.body as CrearPermutaAdminDto);
    res.status(201).json({ status: 'ok', data: permuta });
  } catch (err) {
    next(err);
  }
}

export async function editarPermutaHandler(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const permuta = await adminService.editarPermuta(
      String(req.params.id),
      req.body as EditarPermutaAdminDto,
    );
    res.json({ status: 'ok', data: permuta });
  } catch (err) {
    next(err);
  }
}

export async function desactivarPermutaHandler(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    await adminService.desactivarPermuta(String(req.params.id));
    res.json({ status: 'ok', message: 'Permuta desactivada' });
  } catch (err) {
    next(err);
  }
}

// ─── Planes de Pago ───────────────────────────────────────────────────────

export async function listarPlanesPagoHandler(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const result = await adminService.listarPlanesPago(req.query as unknown as PaginationParams);
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
    const plan = await adminService.crearPlanPago(req.body as CrearPlanPagoAdminDto);
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
    const plan = await adminService.editarPlanPago(
      String(req.params.id),
      req.body as EditarPlanPagoAdminDto,
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
    await adminService.desactivarPlanPago(String(req.params.id));
    res.json({ status: 'ok', message: 'Plan de pago desactivado' });
  } catch (err) {
    next(err);
  }
}
