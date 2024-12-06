import { NextFunction, Request, Response } from "express";
import { number, object, string } from "yup";
import validateSchema from "../../common/validate-schema";
import { UserRoleEnum, UserSubRoleEnum } from "../../../model/user";

export class UserValidate {
  async update(req: Request, res: Response, next: NextFunction) {
    const schema = object({
      params: object({
        id: string().uuid().required(),
      }).required(),
      body: object({
        fullName: string().optional(),
        email: string().email().optional(),
        role: string().oneOf(Object.values(UserRoleEnum)).required(),
        subRole: string().oneOf(Object.values(UserSubRoleEnum)).optional(),
      }).required(),
    });

    await validateSchema(schema, req, next);
  }
}
