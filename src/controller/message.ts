import { UUID } from "crypto";
import { Response } from "express";
import { asyncHandler } from "../lib/common/async-handler";
import { responseHandler } from "../lib/common/response-handler";
import { AuthenticatedRequest } from "../lib/middleware/auth";
import { MessageServiceImpl } from "../service/message";
import { PaginationQueries } from "../interface";
export class MessageController {
  private service = new MessageServiceImpl();

  findAndCountAllByBranchId = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const UserId = req.user.id;
    const { BranchId } = req.params;

    const result = await this.service.findAndCountAllByBranchId(
      BranchId as UUID,
      UserId,
      req.query as PaginationQueries,
    );
    res.status(200).json(responseHandler(true, "MESSAGES_BY_BRANCH_FOUND", result));
  });
}
