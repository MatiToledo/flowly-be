import { NextFunction, Request, Response } from "express";
import { AnyObjectSchema } from "yup";

export default async function validateSchema(
  schema: AnyObjectSchema,
  req: Request,
  next: NextFunction,
) {
  try {
    const dataToValidate: Record<string, any> = {};

    if (schema.fields.body) {
      schema = schema.shape({
        body: (schema.fields.body as AnyObjectSchema).noUnknown(true).strict(true),
      });
      dataToValidate.body = req.body;
    }
    if (schema.fields.params) {
      schema = schema.shape({
        params: (schema.fields.params as AnyObjectSchema).noUnknown(true).strict(true),
      });
      dataToValidate.params = req.params;
    }
    if (schema.fields.query) {
      schema = schema.shape({
        query: (schema.fields.query as AnyObjectSchema).noUnknown(true).strict(true),
      });
      dataToValidate.query = req.query;
    }

    await schema.validate(dataToValidate);
    return next();
  } catch (error) {
    error.status = 400;
    error.message = "BAD_REQUEST";
    next(error);
  }
}
