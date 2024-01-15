export class LoggerModel {
    timestamp: string;

    id: number;

    request: RequestLogger;

    response?: ResponseLogger;
}

class RequestLogger {
    type: string;

    query?: string;

    variables?: string;

    method?: string;

    path?: string;

    body?: any;

    params?: any;
}

class ResponseLogger {
    statusCode?: any;

    body: any;
}