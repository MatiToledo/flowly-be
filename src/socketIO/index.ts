import { UUID } from "crypto";
import { Message } from "../model";
import { MessageServiceImpl } from "../service/message";

const messageService = new MessageServiceImpl();

export default function initSocketIO(io: any) {
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
      const message = await messageService.create(msg);
      io.to(message.BranchId).emit("message", message);
    });

    socket.on("disconnect", () => {
      console.log("Usuario desconectado");
    });
  });
}
