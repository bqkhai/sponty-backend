import { TokenExpiredError } from 'jsonwebtoken';

import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';

@Catch(TokenExpiredError)
export class TokenExpiredExceptionFilter implements ExceptionFilter {
  catch(exception: TokenExpiredError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest<Request>();
    const status = 401;
    const message = 'Token has expired';
    console.log(ctx);

    response.status(status).json({
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
