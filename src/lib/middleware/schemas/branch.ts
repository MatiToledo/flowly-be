import { NextFunction, Request, Response } from "express";
import { number, object, string } from "yup";
import validateSchema from "../../common/validate-schema";

export class BranchValidate {
  async create(req: Request, res: Response, next: NextFunction) {
    const schema = object({
      body: object({
        name: string().required(),
        maxCapacity: number().required(),
      }).required(),
    });

    await validateSchema(schema, req, next);
  }

  async update(req: Request, res: Response, next: NextFunction) {
    const schema = object({
      params: object({
        id: string().uuid().required(),
      }).required(),
      body: object({
        name: string().optional(),
        maxCapacity: number().optional(),
      }).required(),
    });

    await validateSchema(schema, req, next);
  }
}
