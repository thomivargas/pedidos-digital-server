import { z } from 'zod';

export const crearPermutaSchema = z.object({
  nombre: z.string().min(1, 'Nombre requerido'),
  modelo: z.string().min(1, 'Modelo requerido'),
  bateriaMin: z.number().int().min(0).max(100),
  bateriaMax: z.number().int().min(0).max(100),
  precioUsd: z.number().positive('El precio debe ser mayor a 0'),
});

export const editarPermutaSchema = crearPermutaSchema.partial();

export type CrearPermutaDto = z.infer<typeof crearPermutaSchema>;
export type EditarPermutaDto = z.infer<typeof editarPermutaSchema>;
