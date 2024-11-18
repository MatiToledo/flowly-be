import express from "express";
import { MessageController } from "../controller/message";
import { authMiddleware } from "../lib/middleware/auth";

const router = express.Router();
const controller = new MessageController();
// const validate = new BranchValidate();

router.get("/:BranchId", authMiddleware, controller.findAndCountAllByBranchId);

export default router;
