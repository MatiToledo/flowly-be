import { Transaction } from "sequelize";
import { CrudRepository, Pagination, PaginationQueries } from ".";
import { Message } from "../model";
import { UUID } from "crypto";
export interface MessageService {
  create(data: Partial<Message>, transaction?: Transaction): Promise<Message>;
  findAndCountAllByBranchId(
    BranchId: UUID,
    UserId: UUID,
    queries: PaginationQueries,
  ): Promise<{ rows: Message[]; count: number; haveNextPage: boolean }>;
}

export interface MessageRepository {
  create(data: Partial<Message>, transaction?: Transaction): Promise<Message>;
  findAndCountAllByBranchId(
    BranchId: UUID,
    UserId: UUID,
    pagination: Pagination,
  ): Promise<{ rows: Message[]; count: number }>;
  findById(id: UUID, transaction?: Transaction): Promise<Message>;
}
