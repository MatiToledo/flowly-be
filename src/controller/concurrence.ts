import { UUID } from "crypto";
import { Response } from "express";
import { asyncHandler } from "../lib/common/async-handler";
import { responseHandler } from "../lib/common/response-handler";
import { AuthenticatedRequest } from "../lib/middleware/auth";
import { ConcurrenceServiceImpl } from "../service/concurrence";
export class ConcurrenceController {
  private service = new ConcurrenceServiceImpl();

  getActualByBranchAndUser = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const UserId = req.user.id;
    const { BranchId } = req.params;
    const result = await this.service.getActualByBranchAndUser(BranchId as UUID, UserId);
    res.status(200).json(responseHandler(true, "CONCURRENCE_BY_USER_FOUND", result));
  });

  getActualByBranch = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { BranchId } = req.params;
    const result = await this.service.getActualByBranch(BranchId as UUID);
    res.status(200).json(responseHandler(true, "CONCURRENCE_BY_BRANCH_FOUND", result));
  });

  update = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.user;
    const result = await this.service.update({ ...req.body, UserId: id as UUID });
    res.status(201).json(responseHandler(true, "CONCURRENCE_UPDATED", result));
  });
}
