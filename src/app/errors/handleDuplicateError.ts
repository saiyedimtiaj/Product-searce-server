import { TErrorSource, TGenericErrorResponse } from "../interface/error";

export const handleDuplicatError = (err: any): TGenericErrorResponse => {
  const match = err.message.match(/"([^"]*)"/);
  const extretedMessage = match && match[1];
  const statusCode = 400;
  const errorSource: TErrorSource = [
    {
      path: "",
      message: `${extretedMessage} is already exist`,
    },
  ];
  return {
    statusCode,
    message: "Invalide Id!",
    sucess: false,
    errorSource,
  };
};
