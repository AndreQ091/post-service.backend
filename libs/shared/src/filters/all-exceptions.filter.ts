import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request } from 'express';

@Catch()
export class AllExceptionsFilter<T> implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);
  catch(exception: T, host: ArgumentsHost) {
    this.logger.error(exception);
    const ctx = host.switchToHttp();
    const req = ctx.getRequest();
    const res = ctx.getResponse();

    let status: number;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
    }

    if (['graphql', 'rmq'].includes(host.getType())) {
      throw new HttpException(this.respond(status, req, exception), status);
    }

    res.status(status).json(this.respond(status, req, exception));
  }

  private respond(status: number, req: Request, exception: any) {
    return {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: req?.url,
      method: req?.method,
      params: req?.params,
      query: req?.query,
      exception: {
        name: exception?.name,
        message: exception?.message,
      },
    };
  }
}
