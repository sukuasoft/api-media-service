import { Response } from 'express';
import { ApiResponse } from './types/apiResponse';

export function internalError(response: Response<ApiResponse>) {
  response.status(500).json({
    success: false,
    message: 'Internal Error',
  });
}
