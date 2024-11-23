import { UUID } from "crypto";
import { Concurrence, Message } from "../model";
import { MessageServiceImpl } from "../service/message";
import { validateToken } from "../lib/middleware/auth";
import { ConcurrenceServiceImpl } from "../service/concurrence";

const messageService = new MessageServiceImpl();
const concurrenceService = new ConcurrenceServiceImpl();

export default function initSocketIO(io: any) {
  io.use((socket, next) => {
    const token = socket.handshake.headers.token;
    try {
      const tokenData = validateToken(token);
      socket.UserId = tokenData.data.id;
      next();
    } catch (error) {
      next(new Error(error.message));
    }
  });

  io.on("connection", (socket) => {
    socket.on("joinBranch", async (BranchId: UUID) => {
      console.log("Usuario conectado a: ", BranchId);
      socket.join(BranchId);
    });

    socket.on("leaveBranch", (BranchId: UUID) => {
      console.log("Usuario desconectado de: ", BranchId);
      socket.leave(BranchId);
    });

    socket.on("message", async (msg: Partial<Message>) => {
      if (typeof msg === "string") {
        msg = JSON.parse(msg);
      }
      const message = await messageService.create(msg);
      io.to(message.BranchId).emit("message", message);
    });

    socket.on("concurrence", async (concurrence: Partial<Concurrence>) => {
      try {
        if (typeof concurrence === "string") {
          concurrence = JSON.parse(concurrence);
        }
        const result = await concurrenceService.update({ ...concurrence, UserId: socket.UserId });
        io.to(concurrence.BranchId).emit("concurrence", result);
      } catch (error) {
        socket.emit("error", error.message);
      }
    });
    socket.on("disconnect", () => {
      console.log("Usuario desconectado");
    });
  });

  console.log("Socket IO initialized");
}
