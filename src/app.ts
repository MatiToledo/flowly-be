import "dotenv/config";
import bodyParser from "body-parser";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import V1Router from "./routes/index";
import { initDatabase } from "./lib/db";
import helmet from "helmet";
import { errorHandler } from "./lib/common/error-handler";
import { Server } from "socket.io";
import http from "http";
import initSocketIO from "./socketIO";

const app = express();
const server = http.createServer(app);
export const io = new Server(server, {
  cors: {
    origin: "*", // Permitir el origen adecuado (modifica esto si es necesario)
    methods: ["GET", "POST"],
  },
});

app.use(cors());
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}
app.use(helmet());
app.use(bodyParser.json({ limit: "50mb" }));
app.use("/v1", V1Router);

app.use(errorHandler);

initSocketIO(io);
initDatabase();

server.listen(process.env.PORT || 3080, () => {
  console.log(`server is running on port ${process.env.PORT || 3080}`);
});
