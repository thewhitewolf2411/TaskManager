const { ErrorMessages } = require("./ErrorMessages")

class CustomError extends Error {
  status: number;

  errorMeta: any;

  message: string;

  /**
   * @param {string|ErrorTranslation} message
   * @param {number} status
   * @param {any} [metadata]
   */
  constructor(message: string, status: number, metadata:any) {
    super(message)
    this.status = status
    this.errorMeta = metadata
    this.message = message
  }
}

class BadRequestError extends CustomError {
  /**
   * @param {string|ErrorTranslation} [message]
   * @param {any} [metadata]
   */
  constructor(message?: string | null, metadata?: any) {
    super(message || ErrorMessages.BAD_REQUEST.message, 400, metadata)
  }
}

class NotFoundError extends CustomError {
  /**
   * @param {string|ErrorTranslation} [message]
   * @param {any} [metadata]
   */
  constructor(message?: string | null, metadata?:any) {
    super(message || ErrorMessages.NOT_FOUND.message, 404, metadata)
  }
}

class ForbiddenError extends CustomError {
  /**
   * @param {string|ErrorTranslation} [message]
   * @param {any} [metadata]
   */
  constructor(message?: string | null, metadata?: any) {
    super(message || ErrorMessages.FORBIDDEN.message, 403, metadata)
  }
}

class ServerError extends CustomError {
  /**
   * @param {string|ErrorTranslation} [message]
   * @param {any} [metadata]
   */
  constructor(message?: string | null, metadata?:any) {
    super(message || ErrorMessages.SERVER.message, 500, metadata)
  }
}

export default {
  CustomError,
  BadRequestError,
  NotFoundError,
  ForbiddenError,
  ServerError,
}
