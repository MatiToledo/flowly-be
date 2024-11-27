import { NextFunction, Request, Response } from "express";
import { mixed, object, string } from "yup";
import { AlertTypeEnum } from "../../../model/alerts";
import validateSchema from "../../common/validate-schema";

export class AlertValidate {
  async create(req: Request, res: Response, next: NextFunction) {
    const schema = object({
      body: object({
        type: mixed().oneOf(Object.values(AlertTypeEnum)).required(),
        BranchId: string().uuid().required(),
      }).required(),
    });

    await validateSchema(schema, req, next);
  }

  async findByBranch(req: Request, res: Response, next: NextFunction) {
    const schema = object({
      params: object({
        BranchId: string().uuid().required(),
      }).required(),
    });

    await validateSchema(schema, req, next);
  }
}
