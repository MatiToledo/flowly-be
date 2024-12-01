import { NextFunction, Request, Response } from "express";
import { mixed, object, string } from "yup";
import { MonitoringValuesEnum } from "../../../model/monitoring";
import validateSchema from "../../common/validate-schema";

export class MonitoringValidate {
  async create(req: Request, res: Response, next: NextFunction) {
    const schema = object({
      body: object({
        BranchId: string().uuid().required(),
        peopleInBars: mixed().oneOf(Object.values(MonitoringValuesEnum)).required(),
        peopleInDance: mixed().oneOf(Object.values(MonitoringValuesEnum)).required(),
      }).required(),
    });

    await validateSchema(schema, req, next);
  }
  async checkIfAlreadyExistsByBranch(req: Request, res: Response, next: NextFunction) {
    const schema = object({
      params: object({
        BranchId: string().uuid().required(),
      }).required(),
    });

    await validateSchema(schema, req, next);
  }
}
