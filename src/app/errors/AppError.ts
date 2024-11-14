export class AppError extends Error {
  public ststusCode: number;
  constructor(statusCode: number, message: string, stack = "") {
    super(message);
    this.ststusCode = statusCode;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
