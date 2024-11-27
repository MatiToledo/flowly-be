import { UUID } from "crypto";
import { Response } from "express";
import { asyncHandler } from "../lib/common/async-handler";
import { responseHandler } from "../lib/common/response-handler";
import { AuthenticatedRequest } from "../lib/middleware/auth";
import { AlertServiceImpl } from "../service/alert";
import { io } from "../app";
export class AlertController {
  private service = new AlertServiceImpl();

  create = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const UserId = req.user.id;
    const result = await this.service.create(req.body, UserId);
    io.to(req.body.BranchId).emit("newAlert");
    res.status(201).json(responseHandler(true, "ALERT_CREATED", result));
  });

  findByBranch = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { BranchId } = req.params;
    const result = await this.service.findByBranch(BranchId as UUID);
    res.status(201).json(responseHandler(true, "ALERT_CREATED", result));
  });
}
