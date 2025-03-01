export interface ErrorInterface{
    stack: string,
    code: string,
    message: string,
    response: {
        data: {
            error: string
        }
    }
}