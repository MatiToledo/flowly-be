import { Response } from "express";
import { asyncHandler } from "../lib/common/async-handler";
import { responseHandler } from "../lib/common/response-handler";
import { AuthenticatedRequest } from "../lib/middleware/auth";
import { UserServiceImpl } from "../service/user";
import { sequelize } from "../lib/db";
import { UUID } from "crypto";

export class UserController {
  private service = new UserServiceImpl();

  me = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.user;
    const result = await this.service.findById(id);
    res.status(200).json(responseHandler(true, "USER_FOUND", result));
  });

  update = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const result = await sequelize.transaction(async (transaction) => {
      return await this.service.update(id as UUID, req.body, transaction);
    });
    res.status(201).json(responseHandler(true, "USER_UPDATED", result));
  });

  delete = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const UserId = req.user.id;
    const result = await sequelize.transaction(async (transaction) => {
      return await this.service.delete(UserId, transaction);
    });
    res.status(201).json(responseHandler(true, "USER_DELETED", result));
  });
}
