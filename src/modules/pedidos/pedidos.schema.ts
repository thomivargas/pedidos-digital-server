import { z } from 'zod';
import { sanitizeHtml } from '@utils/sanitize';

const MetodoPago = z.enum(['EFECTIVO', 'TRANSFERENCIA', 'TARJETA']);

export const crearPedidoSchema = z
  .object({
    nombreProducto: z.string().min(1, 'Nombre del producto requerido').transform(sanitizeHtml),
    precio: z.number().positive('El precio debe ser mayor a 0'),
    cotizacionDolar: z.number().positive('La cotización debe ser mayor a 0'),
    sku: z.string().min(1, 'SKU requerido').transform(sanitizeHtml),
    observacion: z.string().transform(sanitizeHtml).optional(),
    metodoPago: MetodoPago.default('EFECTIVO'),
    planPagoId: z.string().optional(),
    permutaModelo: z.string().transform(sanitizeHtml).optional(),
    permutaBateria: z.number().int().min(0).max(100).optional(),
    permutaValorUsd: z.number().positive().optional(),
  })
  .refine(
    (data) => {
      if (data.metodoPago === 'TARJETA' && !data.planPagoId) return false;
      return true;
    },
    { message: 'Plan de pago requerido para pagos con tarjeta', path: ['planPagoId'] },
  );

export type CrearPedidoDto = z.infer<typeof crearPedidoSchema>;
