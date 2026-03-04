import { prisma } from '@config/database';

interface CambioEstadoParams {
  entidadId: string;
  antes: string;
  despues: string;
  usuarioId?: string;
}

export async function registrarCambioEstado(params: CambioEstadoParams) {
  return prisma.auditLog.create({
    data: {
      entidad: 'Pedido',
      accion: 'CAMBIO_ESTADO',
      ...params,
    },
  });
}
