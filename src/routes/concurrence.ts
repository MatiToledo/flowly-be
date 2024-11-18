import express from "express";
import { ConcurrenceController } from "../controller/concurrence";
import { authMiddleware } from "../lib/middleware/auth";
import { ConcurrenceValidate } from "../lib/middleware/schemas/concurrence";

const router = express.Router();
const controller = new ConcurrenceController();
const validate = new ConcurrenceValidate();

router.get(
  "/:BranchId",
  authMiddleware,
  validate.getActualByBranchId,
  controller.getActualByBranchId,
);

router.patch("/", authMiddleware, validate.update, controller.update);

export default router;
