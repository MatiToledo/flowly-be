import { NextFunction, Request, Response } from "express";
import { mixed, number, object, string } from "yup";
import { UserRoleEnum, UserSubRoleEnum } from "../../../model/user";
import validateSchema from "../../common/validate-schema";

export class AuthValidate {
  async logUp(req: Request, res: Response, next: NextFunction) {
    const schema = object({
      body: object({
        Auth: object({
          email: string().email().required(),
          password: string().required(),
        }).required(),
        User: object({
          fullName: string().required(),
          email: string().email().required(),
          role: mixed<UserRoleEnum>().oneOf(Object.values(UserRoleEnum)).required(),
          subRole: mixed<UserSubRoleEnum>().oneOf(Object.values(UserSubRoleEnum)).required(),
          timeZone: mixed().when(["role", "subRole"], {
            is: (role: UserRoleEnum, subRole: UserSubRoleEnum) =>
              role === UserRoleEnum.PARTNER && subRole !== UserSubRoleEnum.PARTNER, // Si el role es PARTNER pero subRole no es PARTNER
            then: () =>
              string().required("TimeZone is required for PARTNER role and non-PARTNER subRole"), // Requiere branchName
            otherwise: () => mixed().optional(), // En otro caso, branchName es opcional
          }),
          BranchId: mixed().when(["role", "subRole"], {
            is: (role: UserRoleEnum, subRole: UserSubRoleEnum) =>
              role === UserRoleEnum.PARTNER && subRole === UserSubRoleEnum.PARTNER, // Si role es PARTNER y subRole es PARTNER
            then: () =>
              string().uuid().required("BranchId is required for PARTNER role and PARTNER subRole"), // Requiere BranchId
            otherwise: () => mixed().optional(), // En otro caso, BranchId es opcional
          }),
          branchName: mixed().when(["role", "subRole"], {
            is: (role: UserRoleEnum, subRole: UserSubRoleEnum) =>
              role === UserRoleEnum.PARTNER && subRole !== UserSubRoleEnum.PARTNER, // Si el role es PARTNER pero subRole no es PARTNER
            then: () =>
              string().required("BranchName is required for PARTNER role and non-PARTNER subRole"), // Requiere branchName
            otherwise: () => mixed().optional(), // En otro caso, branchName es opcional
          }),
        }).required(),
      }).required(),
    });
    await validateSchema(schema, req, next);
  }
  async logIn(req: Request, res: Response, next: NextFunction) {
    const schema = object({
      body: object({
        password: string().required(),
        email: string().email().required(),
        role: mixed<UserRoleEnum>().oneOf(Object.values(UserRoleEnum)).required(),
      }),
    });

    await validateSchema(schema, req, next);
  }
  async updatePassword(req: Request, res: Response, next: NextFunction) {
    const schema = object({
      body: object({
        password: string().required(),
        newPassword: string().required(),
      }),
    });

    await validateSchema(schema, req, next);
  }
}
