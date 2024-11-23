import express from "express";
import { adminMiddleware } from "../lib/middleware/auth";
import { MetricsController } from "../controller/metrics";

const router = express.Router();
const controller = new MetricsController();

router.get("/:BranchId", adminMiddleware, controller.getActualByBranchId);

export default router;
