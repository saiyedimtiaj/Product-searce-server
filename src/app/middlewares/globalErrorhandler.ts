import { ErrorRequestHandler } from "express";
import { TErrorSource } from "../interface/error";
import { AppError } from "../errors/AppError";
import { validationError } from "../errors/handleValidationError";
import { handleCastError } from "../errors/handleCastError";
import { handleDuplicatError } from "../errors/handleDuplicateError";

const globalErrorHandeller: ErrorRequestHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Somethis went worng!";

  let errorSourse: TErrorSource = [
    {
      path: "",
      message: "Something went wrong!",
    },
  ];

  if (err instanceof AppError) {
    statusCode = err.ststusCode;
    (message = err.message),
      (errorSourse = [
        {
          path: "",
          message: err.message,
        },
      ]);
  } else if (err.name === "ValidationError") {
    const error = validationError(err);
    message = error.message;
    errorSourse = error.errorSource;
  } else if (err?.name === "CastError") {
    const simplifildError = handleCastError(err);
    message = simplifildError?.message;
    errorSourse = simplifildError?.errorSource;
  } else if (err?.code === 11000) {
    const simplifildError = handleDuplicatError(err);
    message = simplifildError?.message;
    errorSourse = simplifildError?.errorSource;
  } else if (err instanceof Error) {
    message = err.message;
    errorSourse = [
      {
        path: "",
        message: err.message,
      },
    ];
  }

  return res.status(statusCode).send({
    sucess: false,
    message: message,
    errorSourse,
    stack: err.stack,
    err,
  });
};

export default globalErrorHandeller;
