import express from "express";
import { ConcurrenceController } from "../controller/concurrence";
import { adminMiddleware, authMiddleware } from "../lib/middleware/auth";
import { ConcurrenceValidate } from "../lib/middleware/schemas/concurrence";

const router = express.Router();
const controller = new ConcurrenceController();
const validate = new ConcurrenceValidate();

router.get(
  "/branch/:BranchId",
  authMiddleware,
  validate.getActualByBranch,
  controller.getActualByBranchAndUser,
);

router.get(
  "/dashboard/branch/:BranchId",
  adminMiddleware,
  validate.getActualByBranch,
  controller.getActualByBranch,
);

router.patch("/", authMiddleware, validate.update, controller.update);

export default router;
