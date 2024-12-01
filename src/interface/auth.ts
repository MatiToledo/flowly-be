import { Transaction } from "sequelize";
import { CrudRepository } from ".";
import { Branch } from "../model";
import { User, UserRoleEnum, UserSubRoleEnum } from "../model/user";
import { Auth } from "./../model/auth";
import { UUID } from "crypto";

export interface AuthService {
  logUp(data: LogUpBody, transaction: Transaction): Promise<User>;
  logIn(data: LogInBody): Promise<LogInResponse>;
  updatePassword(id: UUID, data: Partial<Auth>): Promise<void>;
}

export interface AuthRepository {
  create(data: Partial<Auth>, transaction?: Transaction): Promise<Auth>;
  update(
    id: UUID,
    data: Partial<Auth>,
    transaction?: Transaction,
  ): Promise<{ affectedCount: number; affectedRows: Auth[] }>;
  delete(id: UUID, transaction?: Transaction): Promise<boolean>;
}

export interface LogInBody {
  email: string;
  password: string;
  role: UserRoleEnum;
}

export interface LogInResponse {
  token: string;
  role: UserRoleEnum;
  subRole: UserSubRoleEnum;
}

export interface LogUpBody {
  Auth: Partial<Auth>;
  User: Partial<User>;
  Branch: Partial<Branch>;
}
