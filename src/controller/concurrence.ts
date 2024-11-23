import { Response } from "express";
import { asyncHandler } from "../lib/common/async-handler";
import { responseHandler } from "../lib/common/response-handler";
import { AuthenticatedRequest } from "../lib/middleware/auth";
import { ConcurrenceServiceImpl } from "../service/concurrence";
import { UUID } from "crypto";
export class ConcurrenceController {
  private service = new ConcurrenceServiceImpl();

  getActualByBranchId = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const UserId = req.user.id;
    const { BranchId } = req.params;
    const result = await this.service.getActualByBranchId(BranchId as UUID, UserId);
    res.status(201).json(responseHandler(true, "USER_FOUND", result));
  });

  update = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.user;
    const result = await this.service.update({ ...req.body, UserId: id as UUID });
    res.status(201).json(responseHandler(true, "USER_FOUND", result));
  });
}
