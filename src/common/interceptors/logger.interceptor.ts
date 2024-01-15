import {
    CallHandler,
    ContextType,
    ExecutionContext,
    Logger,
    NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { LoggerModel } from '../models/logger.model';
import { GqlExecutionContext } from '@nestjs/graphql';
import * as moment from 'moment';

export class LoggerInterceptor implements NestInterceptor {
    private logger = new Logger('😌😍 ResponseInterceptor');

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const requestType = context.getType<ContextType | 'graphql'>();
        const request = GqlExecutionContext.create(context).getContext().req;

        return next.handle().pipe(
            map((res) => {
                const now = Date.now();
                let logData: LoggerModel;
                if (requestType === 'graphql') {
                    const requestQuery: string = request.body['query'];
                    const variables = request.body['variables'];

                    logData = {
                        timestamp: moment().format('HH:mm:ss DD-MM-YYYY'),
                        id: now,
                        request: {
                            type: requestType,
                            variables: variables,
                            query: requestQuery,
                        },
                        response: {
                            body: res,
                        },
                    };
                }
                else {
                    // http request
                    const httpRequest = context.switchToHttp().getRequest();

                    logData = {
                        timestamp: moment().format('HH:mm:ss DD-MM-YYYY'),
                        id: now,
                        request: {
                            type: requestType,
                            body: request.body,
                            path: httpRequest?.path,
                        },
                        response: {
                            body: res,
                        },
                    };
                }

                this.logger.debug(
                    `Time: ${Date.now() - now} ms`,
                    logData
                );

                return res;
            }),
        );
    }
}