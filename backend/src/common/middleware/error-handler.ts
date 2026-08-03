import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';

export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Error:', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  // Prisma unique constraint violation
  if (err instanceof Prisma.PrismaClientKnownRequestError || (err as any).code === 'P2002') {
    if ((err as any).code === 'P2002') {
      return res.status(409).json({
        success: false,
        data: null,
        error: 'Duplicate entry - record already exists',
      });
    }
  }

  // Zod validation errors handled in validate middleware

  // AppError (operational errors)
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      data: null,
      error: err.message,
    });
  }

  // Default to 500 for unknown errors
  return res.status(500).json({
    success: false,
    data: null,
    error: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : err.message,
  });
};