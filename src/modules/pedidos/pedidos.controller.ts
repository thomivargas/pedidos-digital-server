import { asyncHandler } from '@utils/asyncHandler';
import * as pedidosService from './pedidos.service';
import type { CrearPedidoDto } from './pedidos.schema';
import type { PaginationParams } from '@utils/pagination';

export const crearPedidoHandler = asyncHandler(async (req, res) => {
  const pedido = await pedidosService.crearPedido(req.body as CrearPedidoDto, req.user!.sub);
  res.status(201).json({ status: 'ok', data: pedido });
});

export const listarPedidosHandler = asyncHandler(async (req, res) => {
  const result = await pedidosService.listarMisPedidos(
    req.user!.sub,
    req.query as unknown as PaginationParams,
  );
  res.json({ status: 'ok', ...result });
});

export const enviarACajaHandler = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { pedido, googleForms } = await pedidosService.enviarACaja(
    String(id),
    req.user!.sub,
  );
  res.json({ status: 'ok', data: pedido, googleForms });
});
