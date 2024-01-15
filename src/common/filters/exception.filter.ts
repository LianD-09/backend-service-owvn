import { ArgumentsHost, Catch, HttpException, HttpStatus, ExceptionFilter, Logger, InternalServerErrorException, UnauthorizedException } from "@nestjs/common";
import type { Response, Request } from 'express';
import { LoggerModel } from "../models/logger.model";
import { GqlArgumentsHost } from "@nestjs/graphql";
import * as moment from 'moment';

export interface BaseErrorFormat {
    message: string;
    statusCode: number;
}
export class BaseException extends HttpException {
    constructor(response: BaseErrorFormat, cause?: any) {
        super(response, response.statusCode || HttpStatus.INTERNAL_SERVER_ERROR);
        this.stack = cause;
    }
}

@Catch(HttpException)
export class AllExceptionsFilter implements ExceptionFilter {
    private logger = new Logger('App - HttpExceptionFilter');

    catch(exception: HttpException, host: ArgumentsHost) {
        const httpCtx = host.switchToHttp();
        const request = httpCtx.getRequest<Request>();
        const gqlHost = GqlArgumentsHost.create(host);
        let errorLog: LoggerModel;
        if (!gqlHost.getContext().req) {
            if (exception instanceof InternalServerErrorException) {
                exception = new BaseException(
                    {
                        message: 'Something went wrong.',
                        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                    },
                    exception.stack
                );
            }

            const detailError = exception.getResponse() as BaseErrorFormat;
            const responsePayload = {
                message: detailError.message,
            };
            const response = httpCtx.getResponse<Response>();

            errorLog = {
                timestamp: moment().format('HH:mm:ss DD-MM-YYYY'),
                id: Date.now(),
                request: {
                    type: 'http',
                    method: request.method,
                    path: request.path,
                    body: request.body,
                    params: request.params,
                },
                response: {
                    body: {
                        ...detailError,
                        stacktrace: exception.stack,
                    }
                },
            }

            response
                .status(exception.getStatus() || HttpStatus.BAD_REQUEST)
                .json(responsePayload);
        }
        else {
            if (exception instanceof UnauthorizedException) {
                exception = new BaseException(
                    {
                        message: 'Invalid token',
                        statusCode: HttpStatus.UNAUTHORIZED,
                    },
                    exception.stack,
                );
            }
            else if (exception instanceof InternalServerErrorException) {
                exception = new BaseException(
                    {
                        message: 'Something went wrong.',
                        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                    },
                    exception.stack
                );
            }
            const request = gqlHost.getContext().req;
            const detailError = exception.getResponse() as BaseErrorFormat;
            const variables = request.body['variables'];

            errorLog = {
                timestamp: moment().format('HH:mm:ss DD-MM-YYYY'),
                id: Date.now(),
                request: {
                    type: 'graphql',
                    variables: variables,
                    query: request.body['query'],
                },
                response: {
                    body: {
                        ...detailError,
                        stacktrace: exception.stack,
                    },
                },
            };
        }

        this.logger.error(JSON.stringify(errorLog));
        return exception;
    }
}