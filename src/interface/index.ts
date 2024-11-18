import { Transaction } from "sequelize";
import { UUID } from "crypto";
import { ParsedQs } from "qs"; // Si usas Express, ParsedQs es lo que usa por defecto para consultas

export interface CrudRepository<T> {
  findById(id: UUID, transaction?: Transaction): Promise<T>;
  create(data: Partial<T>, transaction?: Transaction): Promise<T>;
  update(
    id: UUID,
    data: Partial<T>,
    transaction?: Transaction,
  ): Promise<{ affectedCount: number; affectedRows: T[] }>;
  delete(id: UUID, transaction?: Transaction): Promise<boolean>;
}

export interface PaginationQueries extends ParsedQs {
  limit: string;
  page: string;
}

export interface Pagination {
  limit: number;
  offset: number;
}
