import express from "express";
import { AuthController } from "../controller/auth";
import { AuthValidate } from "../lib/middleware/schemas/auth";
import { authMiddleware } from "../lib/middleware/auth";

const router = express.Router();
const controller = new AuthController();
const validate = new AuthValidate();

router.post("/", validate.logUp, controller.logUp);

router.post("/logIn", validate.logIn, controller.logIn);

router.patch("/password", authMiddleware, validate.updatePassword, controller.updatePassword);

export default router;
