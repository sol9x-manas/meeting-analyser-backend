import { Request, Response, NextFunction } from "express";

/**
 * Wrap async controllers
 * so errors automatically go to global handler.
 */
export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) {
  return function (req: Request, res: Response, next: NextFunction) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}