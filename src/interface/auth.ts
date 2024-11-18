import { CrudRepository } from ".";
import { UserRoleEnum } from "../model/user";
import { Auth } from "./../model/auth";

export interface LogInBody {
  email: string;
  password: string;
  role: UserRoleEnum;
}

export interface AuthService {}

export interface AuthRepository extends CrudRepository<Auth> {}
