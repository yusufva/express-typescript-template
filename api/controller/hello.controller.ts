import { Request, Response, NextFunction } from 'express';

/**
 * Handles the GET /hello request.
 * @param _req - The Express request object (unused).
 * @param res - The Express response object.
 * @param _next - The next middleware function (unused).
 */
export function getHello(_req: Request, res: Response, _next: NextFunction): void {
  res.status(200).json({
    code: 200,
    message: 'OK',
  });
}