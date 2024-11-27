import express from "express";
import AuthRoute from "./auth";
import UserRoute from "./user";
import BranchRoute from "./branch";
import MessageRoute from "./message";
import ConcurrenceRoute from "./concurrence";
import AlertRoute from "./alert";
import MetricsRoute from "./metrics";

const router = express.Router();

router.use("/auth", AuthRoute);
router.use("/user", UserRoute);
router.use("/branch", BranchRoute);
router.use("/message", MessageRoute);
router.use("/concurrence", ConcurrenceRoute);
router.use("/alert", AlertRoute);
router.use("/metrics", MetricsRoute);

export default router;
