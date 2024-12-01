import { MESSAGES_DICTIONARY } from "./messages";

export function responseHandler(success: boolean, message: string, body?: any) {
  return {
    success,
    message: MESSAGES_DICTIONARY[message],
    result: body,
  };
}
