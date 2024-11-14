import mongoose from "mongoose";
import { TErrorSource, TGenericErrorResponse } from "../interface/error";

export const validationError = (
  err: mongoose.Error.ValidationError
): TGenericErrorResponse => {
  let errorSource: TErrorSource = Object.values(err?.errors).map(
    (val: mongoose.Error.ValidatorError | mongoose.Error.CastError) => {
      return {
        path: val?.path,
        message: val?.message,
      };
    }
  );

  const statusCode = 400;
  return {
    statusCode,
    message: "Validation Error!",
    sucess: false,
    errorSource,
  };
};
