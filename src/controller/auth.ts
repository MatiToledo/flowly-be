import { UUID } from "crypto";
import { Request, Response } from "express";
import { asyncHandler } from "../lib/common/async-handler";
import { responseHandler } from "../lib/common/response-handler";
import { sequelize } from "../lib/db";
import { AuthenticatedRequest } from "../lib/middleware/auth";
import { AuthServiceImpl } from "../service/auth";

export class AuthController {
  private service = new AuthServiceImpl();

  logUp = asyncHandler(async (req: Request, res: Response) => {
    const result = await sequelize.transaction(async (transaction) => {
      return await this.service.logUp(req.body, transaction);
    });
    res.status(201).json(responseHandler(true, "LOG_UP_SUCCESS", result));
  });

  logIn = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.service.logIn(req.body);
    res.status(200).json(responseHandler(true, "LOG_IN_SUCCESS", result));
  });

  updatePassword = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.user;
    const result = await this.service.updatePassword(id as UUID, req.body);
    res.status(201).json(responseHandler(true, "PASSWORD_UPDATED", result));
  });
}
