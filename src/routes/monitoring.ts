import express from "express";
import { MonitoringController } from "../controller/monitoring";
import { authMiddleware } from "../lib/middleware/auth";
import { MonitoringValidate } from "../lib/middleware/schemas/monitoring";

const router = express.Router();
const controller = new MonitoringController();
const validate = new MonitoringValidate();

router.post("/", authMiddleware, validate.create, controller.create);

router.get(
  "/branch/:BranchId",
  authMiddleware,
  validate.checkIfAlreadyExistsByBranch,
  controller.checkIfAlreadyExistsByBranch,
);

export default router;
