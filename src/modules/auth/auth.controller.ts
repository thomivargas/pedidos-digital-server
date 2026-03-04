import { asyncHandler } from '@utils/asyncHandler';
import * as authService from './auth.service';
import type { LoginDto, RefreshDto } from './auth.schema';

export const loginHandler = asyncHandler(async (req, res) => {
  const result = await authService.login(req.body as LoginDto);
  res.json({ status: 'ok', ...result });
});

export const refreshHandler = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body as RefreshDto;
  const result = await authService.refresh(refreshToken);
  res.json({ status: 'ok', ...result });
});
