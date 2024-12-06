import express from "express";
import { UserController } from "../controller/user";
import { authMiddleware } from "../lib/middleware/auth";
import { UserValidate } from "../lib/middleware/schemas/user";

const router = express.Router();
const controller = new UserController();
const validate = new UserValidate();

router.get("/me", authMiddleware, controller.me);

router.patch("/:id", authMiddleware, validate.update, controller.update);

router.delete("/:id", authMiddleware, controller.delete);

export default router;
