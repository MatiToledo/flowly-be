import express from "express";
import { AlertController } from "../controller/alert";
import { adminMiddleware, authMiddleware } from "../lib/middleware/auth";
import { AlertValidate } from "../lib/middleware/schemas/alert";

const router = express.Router();
const controller = new AlertController();
const validate = new AlertValidate();

router.post("/", authMiddleware, validate.create, controller.create);

router.get("/branch/:BranchId", authMiddleware, validate.findByBranch, controller.findByBranch);

export default router;
