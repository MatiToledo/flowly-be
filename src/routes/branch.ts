import express from "express";
import { BranchController } from "../controller/branch";
import { adminMiddleware } from "../lib/middleware/auth";
import { BranchValidate } from "../lib/middleware/schemas/branch";

const router = express.Router();
const controller = new BranchController();
const validate = new BranchValidate();

router.post("/", adminMiddleware, validate.create, controller.create);
router.patch("/:id", adminMiddleware, validate.update, controller.update);

export default router;
