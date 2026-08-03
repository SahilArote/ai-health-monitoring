import { Response } from 'express';

export interface ApiResponse<T = any> {
  success: boolean;
  data: T | null;
  error: string | null;
}

export const sendSuccess = <T>(res: Response, data: T, statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    data,
    error: null,
  } as ApiResponse<T>);
};

export const sendError = (res: Response, message: string, statusCode = 400) => {
  return res.status(statusCode).json({
    success: false,
    data: null,
    error: message,
  } as ApiResponse);
};
