import { UUID } from "crypto";
import { Transaction } from "sequelize";
import { Branch } from "../model";

export interface BranchService {
  findById(id: UUID): Promise<Branch>;
  update(id: UUID, data: Partial<Branch>): Promise<Branch>;
  create(data: Partial<Branch>, UserId: UUID, transaction?: Transaction): Promise<Branch>;
}

export interface BranchRepository {
  create(data: Partial<Branch>, transaction?: Transaction): Promise<Branch>;
  update(
    id: UUID,
    data: Partial<Branch>,
  ): Promise<{ affectedCount: number; affectedRows: Branch[] }>;
  findById(id: UUID, transaction?: Transaction): Promise<Branch>;
}
