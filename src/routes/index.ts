import express from "express";
import AppRoute from "./../routes/app";

const router = express.Router();

router.use("/app", AppRoute);

export default router;
