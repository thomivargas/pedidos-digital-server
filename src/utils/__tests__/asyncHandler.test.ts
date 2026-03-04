import { describe, it, expect, vi } from 'vitest';
import { asyncHandler } from '../asyncHandler';

describe('asyncHandler', () => {
  it('llama a la función y no llama a next si no hay error', async () => {
    const fn = vi.fn().mockResolvedValue(undefined);
    const next = vi.fn();
    const req = {} as any;
    const res = {} as any;

    await asyncHandler(fn)(req, res, next);

    expect(fn).toHaveBeenCalledWith(req, res, next);
    expect(next).not.toHaveBeenCalled();
  });

  it('llama a next con el error si la función falla', async () => {
    const error = new Error('test error');
    const fn = vi.fn().mockRejectedValue(error);
    const next = vi.fn();
    const req = {} as any;
    const res = {} as any;

    await asyncHandler(fn)(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});
