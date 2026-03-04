import { z } from 'zod';
import { paginationSchema } from '../../utils/pagination';
import { sanitizeHtml } from '../../utils/sanitize';

const EstadoPedido = z.enum(['PENDIENTE', 'ENVIADO_A_CAJA', 'COMPLETADO']);
const Rol = z.enum(['ADMIN', 'VENDEDOR']);

export const adminPedidosQuerySchema = paginationSchema.extend({
  estado: EstadoPedido.optional(),
  vendedorId: z.string().optional(),
});

export const adminVendedoresQuerySchema = paginationSchema.extend({
  sucursalId: z.string().optional(), // ID real o "none" para sin sucursal
});

export type AdminVendedoresQuery = z.infer<typeof adminVendedoresQuerySchema>;

export const crearUsuarioSchema = z.object({
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').transform(sanitizeHtml),
  usuario: z.string().min(2, 'El usuario debe tener al menos 2 caracteres').transform(sanitizeHtml),
  correo: z.string().email('Correo inválido'),
  contrasena: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
  rol: Rol.default('VENDEDOR'),
});

export const crearSucursalSchema = z.object({
  nombre: z.string().min(1, 'El nombre es requerido').transform(sanitizeHtml),
  direccion: z.string().transform(sanitizeHtml).optional(),
});

export const asignarVendedoresSchema = z.object({
  vendedorIds: z.array(z.string()),
});

export const crearPermutaAdminSchema = z.object({
  nombre: z.string().min(1, 'Nombre requerido').transform(sanitizeHtml),
  modelo: z.string().min(1, 'Modelo requerido').transform(sanitizeHtml),
  bateriaMin: z.number().int().min(0).max(100),
  bateriaMax: z.number().int().min(0).max(100),
  precioUsd: z.number().positive('El precio debe ser mayor a 0'),
});

export const editarPermutaAdminSchema = crearPermutaAdminSchema.partial();

export const crearPlanPagoAdminSchema = z.object({
  marca: z.string().min(1, 'Marca requerida').transform(sanitizeHtml),
  cuotas: z.number().int().positive('Las cuotas deben ser mayor a 0'),
  interesPct: z.number().min(0, 'El interés no puede ser negativo'),
  ivaPct: z.number().min(0, 'El IVA no puede ser negativo'),
});

export const editarPlanPagoAdminSchema = crearPlanPagoAdminSchema.partial();

export type AdminPedidosQuery = z.infer<typeof adminPedidosQuerySchema>;
export type CrearUsuarioDto = z.infer<typeof crearUsuarioSchema>;
export type CrearSucursalDto = z.infer<typeof crearSucursalSchema>;
export type AsignarVendedoresDto = z.infer<typeof asignarVendedoresSchema>;
export type CrearPermutaAdminDto = z.infer<typeof crearPermutaAdminSchema>;
export type EditarPermutaAdminDto = z.infer<typeof editarPermutaAdminSchema>;
export type CrearPlanPagoAdminDto = z.infer<typeof crearPlanPagoAdminSchema>;
export type EditarPlanPagoAdminDto = z.infer<typeof editarPlanPagoAdminSchema>;
