import { UUID } from "crypto";
import { Transaction } from "sequelize";
import { MessageService } from "../interface/message";
import { Message } from "../model";
import { MessageRepositoryImpl } from "../repository/message";
import { PaginationQueries } from "../interface";
import buildPagination from "../utils/buildPagination";

export class MessageServiceImpl implements MessageService {
  private repository = new MessageRepositoryImpl();

  async create(data: Partial<Message>, transaction?: Transaction): Promise<Message> {
    const message = await this.repository.create(data, transaction);
    return await this.repository.findById(message.id, transaction);
  }

  async findAndCountAllByBranchId(
    BranchId: UUID,
    UserId: UUID,
    queries: PaginationQueries,
  ): Promise<{ rows: Message[]; count: number; haveNextPage: boolean }> {
    const pagination = buildPagination(queries.page, queries.limit);
    const totalLoaded = parseInt(queries.page) * pagination.limit;
    const result = await this.repository.findAndCountAllByBranchId(BranchId, UserId, pagination);
    return {
      rows: result.rows.reverse(),
      count: result.count,
      haveNextPage: totalLoaded < result.count,
    };
  }
}
