import { UUID } from "crypto";
import { CrudRepository } from ".";
import { User } from "../model";
import { Transaction } from "sequelize";
import { UserRoleEnum } from "../model/user";

export interface UserService {
  delete(UserId: UUID, transaction: Transaction): Promise<void>;
  findByIdWithAuth(id: UUID): Promise<User>;
  findById(id: UUID): Promise<User>;
  throwIfAlreadyExists(conditions: { email: string; role: UserRoleEnum }): Promise<void>;
  deleteUsersFromBranch(BranchId: UUID, UserId: UUID, transaction: Transaction): Promise<void>;
  findByCredentials(conditions: { email: string; role: UserRoleEnum }): Promise<User | null>;
  create(data: Partial<User>, transaction: Transaction): Promise<User>;
}

export interface UserRepository {
  throwIfAlreadyExists(conditions: { email: string; role: UserRoleEnum }): Promise<void>;
  findByCredentials(conditions: { email: string; role: UserRoleEnum }): Promise<User>;
  deleteUsersFromBranch(BranchId: UUID, transaction: Transaction): Promise<void>;
  create(data: Partial<User>, transaction?: Transaction): Promise<User>;
  update(
    id: UUID,
    data: Partial<User>,
    transaction: Transaction,
  ): Promise<{ affectedCount: number; affectedRows: User[] }>;
  findByIdWithAuth(id: UUID, transaction?: Transaction): Promise<User>;
  findById(id: UUID, transaction?: Transaction): Promise<User>;
  delete(id: UUID, transaction?: Transaction): Promise<boolean>;
}
