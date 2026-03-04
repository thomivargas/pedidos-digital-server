import { asyncHandler } from '@utils/asyncHandler';
import * as permutasService from './permutas.service';
import type { CrearPermutaDto, EditarPermutaDto } from './permutas.schema';
import type { PaginationParams } from '@utils/pagination';

export const listarPermutasHandler = asyncHandler(async (req, res) => {
  const result = await permutasService.listarPermutas(
    req.query as unknown as PaginationParams,
  );
  res.json({ status: 'ok', ...result });
});

export const crearPermutaHandler = asyncHandler(async (req, res) => {
  const permuta = await permutasService.crearPermuta(req.body as CrearPermutaDto);
  res.status(201).json({ status: 'ok', data: permuta });
});

export const editarPermutaHandler = asyncHandler(async (req, res) => {
  const permuta = await permutasService.editarPermuta(
    String(req.params.id),
    req.body as EditarPermutaDto,
  );
  res.json({ status: 'ok', data: permuta });
});

export const desactivarPermutaHandler = asyncHandler(async (req, res) => {
  await permutasService.desactivarPermuta(String(req.params.id));
  res.json({ status: 'ok', message: 'Permuta desactivada' });
});
