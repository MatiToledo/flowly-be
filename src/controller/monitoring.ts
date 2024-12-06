import { Response } from "express";
import { asyncHandler } from "../lib/common/async-handler";
import { responseHandler } from "../lib/common/response-handler";
import { AuthenticatedRequest } from "../lib/middleware/auth";
import { MonitoringServiceImpl } from "../service/monitoring";
import { UUID } from "crypto";
export class MonitoringController {
  private service = new MonitoringServiceImpl();

  create = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const result = await this.service.create(req.body);
    res.status(201).json(responseHandler(true, "MONITORING_CREATED", result));
  });

  checkIfAlreadyExistsByBranch = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { BranchId } = req.params;
    const result = await this.service.checkIfAlreadyExistsByBranch(BranchId as UUID);
    res.status(201).json(responseHandler(true, "MONITORING_CREATED", result));
  });
  findLatest = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { BranchId } = req.params;
    const result = await this.service.findLatest(BranchId as UUID);
    res.status(201).json(responseHandler(true, "MONITORING_FOUND", result));
  });
}
