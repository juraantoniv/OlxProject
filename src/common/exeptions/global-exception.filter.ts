import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    let messages: string | string[];
    const request = ctx.getRequest<Request>;

    let httpStatus = null;

    if (exception instanceof HttpException) {
      httpStatus = exception.getStatus();
      messages = (exception as any).response?.message ?? exception.message;
    } else {
      httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
      messages = (exception as any).message;
    }

    messages = Array.isArray(messages) ? messages : [messages];


    const responseBody = {
      statusCode: httpStatus,
      timestamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(ctx.getRequest()),
      messages: messages,
    };

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
