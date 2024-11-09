import express from "express";
import { AppController } from "../controller/app.controller";

const router = express.Router();
const appController = new AppController();

router.get("/", appController.healthCheck);

export default router;
