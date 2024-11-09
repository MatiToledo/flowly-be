export function responseHandler(success: boolean, message: string, body?: any) {
  return {
    success,
    message,
    result: body,
  };
}
