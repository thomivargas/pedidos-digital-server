import { Request, Response, NextFunction } from 'express';
import * as permutasService from './permutas.service';
import type { CrearPermutaDto, EditarPermutaDto } from './permutas.schema';
import type { PaginationParams } from '../../utils/pagination';

export async function listarPermutasHandler(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const result = await permutasService.listarPermutas(
      req.query as unknown as PaginationParams,
    );
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
    const permuta = await permutasService.crearPermuta(req.body as CrearPermutaDto);
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
    const permuta = await permutasService.editarPermuta(
      String(req.params.id),
      req.body as EditarPermutaDto,
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
    await permutasService.desactivarPermuta(String(req.params.id));
    res.json({ status: 'ok', message: 'Permuta desactivada' });
  } catch (err) {
    next(err);
  }
}
