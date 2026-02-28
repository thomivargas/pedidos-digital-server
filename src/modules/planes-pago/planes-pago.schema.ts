import { z } from 'zod';

export const crearPlanPagoSchema = z.object({
  marca: z.string().min(1, 'Marca requerida'),
  cuotas: z.number().int().positive('Las cuotas deben ser mayor a 0'),
  interesPct: z.number().min(0, 'El interés no puede ser negativo'),
  ivaPct: z.number().min(0, 'El IVA no puede ser negativo'),
});

export const editarPlanPagoSchema = crearPlanPagoSchema.partial();

export type CrearPlanPagoDto = z.infer<typeof crearPlanPagoSchema>;
export type EditarPlanPagoDto = z.infer<typeof editarPlanPagoSchema>;
