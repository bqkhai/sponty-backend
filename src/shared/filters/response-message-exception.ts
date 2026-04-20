import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { ResponseMessageMap } from '../enums/response-message.enum';
import { FastifyReply, FastifyRequest } from 'fastify';

@Catch(HttpException)
export class ResponseMessageExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<FastifyRequest>();
    const response = ctx.getResponse<FastifyReply>();

    const status = exception.getStatus?.() || 500;
    const responseMessage = exception.getResponse?.();
    const method = request.method;
    const url = request.url;

    // Mặc định
    let code = 'INTERNAL_SERVER_ERROR';
    const message = 'Đã xảy ra lỗi không xác định';

    if (typeof responseMessage === 'string') {
      code = responseMessage;
    } else if (
      typeof responseMessage === 'object' &&
      responseMessage !== null
    ) {
      code = (responseMessage as any)?.message || code;
    }

    const finalMessage = ResponseMessageMap[code] || code;

    // 🔥 Log chi tiết ra console
    console.error(`[${new Date().toISOString()}] ${method} ${url}`);
    console.error(`Status: ${status}`);
    console.error(`Error Code: ${code}`);
    console.error(`Mapped Message: ${finalMessage}`);
    console.error('Request Body:', request.body);
    console.error('Stack Trace:', exception.stack);

    // Gửi response về client
    response.status(status).send({
      code: code,
      message: status !== 404 ? finalMessage : 'Sai đường dẫn',
      path: request.url,
      timestamp: new Date().toLocaleString('vi-VN'),
    });
  }
}
