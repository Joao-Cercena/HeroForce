// src/not-found.filter.ts
import { ExceptionFilter, Catch, NotFoundException, ArgumentsHost } from '@nestjs/common';
import { Response } from 'express';

@Catch(NotFoundException)
export class NotFoundFilter implements ExceptionFilter {
  catch(exception: NotFoundException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    response.status(status).json({
      statusCode: status,
      error: 'Rota não encontrada',
      message: `O endpoint ${request.url} não existe`,
      suggestions: [
        'Acesse /api para ver a documentação',
        'Verifique se o caminho está correto',
      ],
      timestamp: new Date().toISOString(),
    });
  }
}