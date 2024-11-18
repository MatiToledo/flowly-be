import { Response } from "express";
import { asyncHandler } from "../lib/common/async-handler";
import { responseHandler } from "../lib/common/response-handler";
import { AuthenticatedRequest } from "../lib/middleware/auth";
import { BranchServiceImpl } from "../service/branch";
import { sequelize } from "../lib/db";
import { UUID } from "crypto";
export class BranchController {
  private service = new BranchServiceImpl();

  create = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const UserId = req.user.id;
    const result = sequelize.transaction(async (transaction) => {
      return await this.service.create(req.body, UserId, transaction);
    });
    res.status(201).json(responseHandler(true, "USER_FOUND", result));
  });

  update = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const result = await this.service.update(id as UUID, req.body);
    res.status(201).json(responseHandler(true, "USER_FOUND", result));
  });
}
