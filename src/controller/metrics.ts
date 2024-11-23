import { Response } from "express";
import { UUID } from "crypto";
import { asyncHandler } from "../lib/common/async-handler";
import { responseHandler } from "../lib/common/response-handler";
import { AuthenticatedRequest } from "../lib/middleware/auth";
import { MetricsServiceImpl } from "../service/metrics";

export class MetricsController {
  private service = new MetricsServiceImpl();

  getActualByBranchId = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { BranchId } = req.params;
    const result = await this.service.getActualByBranchId(BranchId as UUID);
    res.status(201).json(responseHandler(true, "USER_FOUND", result));
  });
}
