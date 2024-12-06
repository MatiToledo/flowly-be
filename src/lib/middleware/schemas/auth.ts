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
        }).required(),
        Branch: object({
          id: mixed().when(["User.role", "User.subRole"], {
            is: (role: UserRoleEnum, subRole: UserSubRoleEnum) =>
              role === UserRoleEnum.PARTNER && subRole === UserSubRoleEnum.PARTNER,
            then: () =>
              string()
                .uuid()
                .required("Branch.id is required for PARTNER role and PARTNER subRole"),
            otherwise: () => mixed().optional(),
          }),
          name: mixed().when(["User.role", "User.subRole"], {
            is: (role: UserRoleEnum, subRole: UserSubRoleEnum) =>
              role === UserRoleEnum.PARTNER && subRole !== UserSubRoleEnum.PARTNER,
            then: () =>
              string().required("Branch.name is required for PARTNER role and non-PARTNER subRole"),
            otherwise: () => mixed().optional(),
          }),
          maxCapacity: mixed().when(["User.role", "User.subRole"], {
            is: (role: UserRoleEnum, subRole: UserSubRoleEnum) =>
              role === UserRoleEnum.PARTNER && subRole !== UserSubRoleEnum.PARTNER,
            then: () =>
              number().required(
                "Branch.maxCapacity is required for PARTNER role and non-PARTNER subRole",
              ),
            otherwise: () => number().optional(),
          }),
          profitPerPerson: mixed().when(["User.role", "User.subRole"], {
            is: (role: UserRoleEnum, subRole: UserSubRoleEnum) =>
              role === UserRoleEnum.PARTNER && subRole !== UserSubRoleEnum.PARTNER,
            then: () =>
              number().required(
                "Branch.maxCapacity is required for PARTNER role and non-PARTNER subRole",
              ),
            otherwise: () => number().optional(),
          }),
          opening: mixed().when(["User.role", "User.subRole"], {
            is: (role: UserRoleEnum, subRole: UserSubRoleEnum) =>
              role === UserRoleEnum.PARTNER && subRole !== UserSubRoleEnum.PARTNER,
            then: () =>
              string().required(
                "Branch.maxCapacity is required for PARTNER role and non-PARTNER subRole",
              ),
            otherwise: () => string().optional(),
          }),
          closing: mixed().when(["User.role", "User.subRole"], {
            is: (role: UserRoleEnum, subRole: UserSubRoleEnum) =>
              role === UserRoleEnum.PARTNER && subRole !== UserSubRoleEnum.PARTNER,
            then: () =>
              string().required(
                "Branch.maxCapacity is required for PARTNER role and non-PARTNER subRole",
              ),
            otherwise: () => string().optional(),
          }),
          timeZone: mixed().when(["User.role", "User.subRole"], {
            is: (role: UserRoleEnum, subRole: UserSubRoleEnum) =>
              role === UserRoleEnum.PARTNER && subRole !== UserSubRoleEnum.PARTNER,
            then: () =>
              string().required("TimeZone is required for PARTNER role and non-PARTNER subRole"),
            otherwise: () => mixed().optional(),
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
