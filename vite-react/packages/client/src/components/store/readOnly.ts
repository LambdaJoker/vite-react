/*
 * @Author: taotao
 * @LastEditors: taotao
 * @Description: Do not edit
 * @Date: 2025-06-19 08:07:43
 * @LastEditTime: 2025-06-19 08:08:27
 */
import { Request, Response, NextFunction } from 'express';

/**
 * Middleware to enforce a read-only mode based on an environment variable.
 * It blocks all state-changing HTTP methods (POST, PUT, PATCH, DELETE)
 * if the application is not in 'development' mode.
 *
 * @param req The Express request object.
 * @param res The Express response object.
 * @param next The next middleware function.
 */
export const readOnlyMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Allow all GET, HEAD, OPTIONS requests
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    return next();
  }

  // Check for development mode for state-changing methods
  if (process.env.APP_MODE !== 'development') {
    return res.status(403).json({
      message: 'Forbidden: The application is currently in read-only mode. Modifications are not allowed.',
    });
  }

  // If in development mode, proceed with the request
  return next();
}; 