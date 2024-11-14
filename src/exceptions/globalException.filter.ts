import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { isString } from 'class-validator';
import { Request, Response } from 'express';
import { LoggerService } from 'src/service/loggerService/logger.service';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(private loggerService: LoggerService) {}

  catch(exception: Error, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const request = context.getRequest<Request>();
    const correlationId = request.headers['correlationId'];

    this.loggerService.error(
      `Error occur in request ${request.url}`,
      exception,
    );

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const getResponse = exception.getResponse();

      const errorData = this.errorDataBuilder(status, getResponse);
      return response.status(status).json({
        correlationId,
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
        ...errorData,
      });
    }

    return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      correlationId,
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      timestamp: new Date().toISOString(),
      path: request.url,
      errorCode: 'INTERNAL_SERVER_ERROR',
      message: 'Something went wrong!',
    });
  }

  errorDataBuilder(
    status: number,
    exceptionData: string | object,
  ): { errorCode: string; message: string } {
    if (isString(exceptionData)) {
      return { errorCode: HttpStatus[status], message: exceptionData };
    }

    if (
      'message' in exceptionData === false ||
      !isString(exceptionData.message)
    ) {
      return {
        errorCode: HttpStatus[status],
        message: 'Something went wrong!',
      };
    }

    if (
      'error' in exceptionData ||
      'errorCode' in exceptionData === false ||
      !isString(exceptionData.errorCode)
    ) {
      return { errorCode: HttpStatus[status], message: exceptionData.message };
    }

    return {
      errorCode: exceptionData.errorCode,
      message: exceptionData.message,
    };
  }
}
