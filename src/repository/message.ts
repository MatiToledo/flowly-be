import { UUID } from "crypto";
import { Sequelize, Transaction } from "sequelize";
import { MessageRepository } from "../interface/message";
import { Message, User } from "../model";
import { Pagination, PaginationQueries } from "../interface";
export class MessageRepositoryImpl implements MessageRepository {
  async findAndCountAllByBranchId(
    BranchId: UUID,
    UserId: UUID,
    pagination: Pagination,
  ): Promise<{ rows: Message[]; count: number }> {
    try {
      return await Message.findAndCountAll({
        where: { BranchId },
        include: [
          {
            model: User,
            attributes: [],
          },
        ],
        attributes: {
          include: [
            [Sequelize.col("User.fullName"), "sender"],
            [Sequelize.literal(`"User"."id" = '${UserId}'`), "isYou"],
          ],
        },
        order: [["createdAt", "DESC"]],
        ...pagination,
      });
    } catch (error) {
      console.error(error);
      throw new Error(`MESSAGES_NOT_FOUND`);
    }
  }

  async create(data: Partial<Message>, transaction?: Transaction): Promise<Message> {
    try {
      return await Message.create(data, {
        transaction,
      });
    } catch (error) {
      console.error(error);
      throw new Error(`MESSAGE_NOT_CREATED`);
    }
  }

  async findById(id: UUID, transaction?: Transaction): Promise<Message> {
    try {
      return await Message.findByPk(id, {
        transaction,
        include: [
          {
            model: User,
            attributes: [],
          },
        ],
        attributes: {
          include: [
            [Sequelize.col("User.fullName"), "sender"],
            [Sequelize.literal(`"User"."id" = '${id}'`), "isYou"],
          ],
        },
      });
    } catch (error) {
      console.error(error);
      throw new Error("MESSAGE_NOT_FOUND");
    }
  }
}
