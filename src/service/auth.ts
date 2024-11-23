import { Transaction } from "sequelize";
import { Auth, Branch, User } from "../model";
import { AuthRepositoryImpl } from "../repository/auth";
import { generateToken } from "../utils/jwt";
import { hashPassword, verifyPassword } from "../utils/password";
import { AuthService, LogInBody } from "./../interface/auth";
import { BranchServiceImpl } from "./branch";
import { UserServiceImpl } from "./user";
import { UserBranchServiceImpl } from "./userBranch";
import { UUID } from "crypto";
import { DateTime } from "luxon";

export class AuthServiceImpl implements AuthService {
  private repository = new AuthRepositoryImpl();
  private userService = new UserServiceImpl();
  private branchService = new BranchServiceImpl();
  private userBranchService = new UserBranchServiceImpl();
  async logUp(
    data: { Auth: Partial<Auth>; User: Partial<User>; Branch: Partial<Branch> },
    transaction: Transaction,
  ): Promise<User> {
    await this.userService.throwIfAlreadyExists({
      email: data.User.email,
      role: data.User.role,
    });

    data.Auth.password = await hashPassword(data.Auth.password);
    const auth = await this.repository.create(data.Auth, transaction);

    const user = await this.userService.create({ ...data.User, AuthId: auth.id }, transaction);

    if (data.Branch.name) {
      data.Branch.closing = DateTime.fromISO(data.Branch.closing).toFormat("HH:mm");
      data.Branch.opening = DateTime.fromISO(data.Branch.opening).toFormat("HH:mm");

      await this.branchService.create(data.Branch, user.id, transaction);
    } else {
      await this.userBranchService.create(
        { UserId: user.id, BranchId: data.Branch.id },
        transaction,
      );
    }

    return user;
  }
  async logIn(data: LogInBody): Promise<any> {
    const user = await this.userService.findByCredentials({
      email: data.email,
      role: data.role,
    });
    const storedHash = user.Auth.password;
    verifyPassword(data.password, storedHash, "logIn");
    const token = generateToken({ id: user.id, role: user.role, subRole: user.subRole });
    return { token, role: user.role, subRole: user.subRole };
  }

  async updatePassword(id: UUID, data: Partial<Auth>): Promise<void> {
    const user = await this.userService.findByIdWithAuth(id);
    const storedHash = user.Auth.password;
    verifyPassword(data.password, storedHash, "update");
    await this.repository.update(id, {
      password: hashPassword(data.newPassword),
    });
  }
}
