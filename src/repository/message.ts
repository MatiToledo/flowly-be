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
      throw new Error(`NOT_FOUND`);
    }
  }

  async create(data: Partial<Message>, transaction?: Transaction): Promise<Message> {
    try {
      return await Message.create(data, {
        transaction,
      });
    } catch (error) {
      console.error(error);
      throw new Error(`NOT_CREATED`);
    }
  }

  async update(
    id: UUID,
    data: Partial<Message>,
    transaction: Transaction,
  ): Promise<{ affectedCount: number; affectedRows: Message[] }> {
    try {
      const [affectedCount, affectedRows] = await Message.update(data, {
        where: { id },
        transaction,
        returning: true,
      });
      return { affectedCount, affectedRows };
    } catch (error) {
      console.error(error);
      throw new Error(`NOT_UPDATED`);
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
      throw new Error("NOT_FOUND");
    }
  }

  async delete(id: UUID, transaction?: Transaction): Promise<boolean> {
    try {
      const res = await Message.destroy({
        where: { id },
        transaction,
      });
      if (res > 0) {
        return true;
      } else {
        throw new Error();
      }
    } catch (error) {
      console.error(error);
      throw new Error("NOT_DELETED");
    }
  }
}
