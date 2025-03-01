interface ErrorTranslationParams {
  message: string;
}

class ErrorMessage {
  message: string;

  constructor({ message }: ErrorTranslationParams) {
    this.message = message;
  }
}

class ErrorMessages {
  static FORBIDDEN = new ErrorMessage({ message: "Permission denied" });
  static NOT_FOUND = new ErrorMessage({ message: "Not Found" });
  static BAD_REQUEST = new ErrorMessage({ message: "Bad Request" });
  static SERVER = new ErrorMessage({ message: "Internal Server Error" });
}

export { ErrorMessages, ErrorMessage };