import { NextFunction, Request, Response } from "express";
import { number, object, string } from "yup";
import validateSchema from "../../common/validate-schema";

export class BranchValidate {
  async create(req: Request, res: Response, next: NextFunction) {
    const schema = object({
      body: object({
        name: string().required(),
        maxCapacity: number().required(),
        profitPerPerson: number().required(),
        opening: string().required(),
        closing: string().required(),
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
        profitPerPerson: number().optional(),
        opening: string().optional(),
        closing: string().optional(),
      }).required(),
    });

    await validateSchema(schema, req, next);
  }
}
