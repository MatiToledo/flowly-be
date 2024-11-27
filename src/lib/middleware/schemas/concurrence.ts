import { NextFunction, Request, Response } from "express";
import { number, object, string } from "yup";
import validateSchema from "../../common/validate-schema";
import { EntranceTypeEnum } from "../../../model/concurrence";

export class ConcurrenceValidate {
  async update(req: Request, res: Response, next: NextFunction) {
    const schema = object({
      body: object({
        BranchId: string().uuid().required(),
        type: string().oneOf(["entry", "exit"]).required(),
        entranceType: string()
          .oneOf([
            EntranceTypeEnum.FREE,
            EntranceTypeEnum.PAID,
            EntranceTypeEnum.QR,
            EntranceTypeEnum.VIP,
            EntranceTypeEnum.GUEST,
          ])
          .optional()
          .nullable(),
      }).required(),
    });

    await validateSchema(schema, req, next);
  }
  async getActualByBranch(req: Request, res: Response, next: NextFunction) {
    const schema = object({
      params: object({
        BranchId: string().uuid().required(),
      }).required(),
    });

    await validateSchema(schema, req, next);
  }
}
