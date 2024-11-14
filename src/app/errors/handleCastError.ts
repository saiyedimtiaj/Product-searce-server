import { Error } from "mongoose";
import { TErrorSource, TGenericErrorResponse } from "../interface/error";

export const handleCastError = (
  err: Error.CastError
): TGenericErrorResponse => {
  const errorSource: TErrorSource = [
    {
      path: err.path,
      message: err.message,
    },
  ];

  const statusCode = 400;
  return {
    statusCode,
    message: "Invalide Id!",
    sucess: false,
    errorSource,
  };
};
