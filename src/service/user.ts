import { UUID } from "crypto";
import { Transaction } from "sequelize";
import { UserService } from "../interface/user";
import { User, UserRoleEnum } from "../model/user";
import { UserRepositoryImpl } from "../repository/user";

export class UserServiceImpl implements UserService {
  private repository = new UserRepositoryImpl();

  async findByIdWithAuth(id: UUID): Promise<User> {
    return await this.repository.findByIdWithAuth(id);
  }
  async findById(id: UUID): Promise<User> {
    return await this.repository.findById(id);
  }

  async update(id: UUID, data: Partial<User>, transaction: Transaction) {
    // if (data.email) {
    //   await this.repository.findByCredentials({ email: data.email, role: data.role }, "throw");
    // }
    // const {
    //   affectedCount,
    //   affectedRows: [updatedUser],
    // } = await this.repository.update(id, data, transaction);
    // return updatedUser;
  }

  async throwIfAlreadyExists(conditions: { email: string; role: UserRoleEnum }) {
    return await this.repository.throwIfAlreadyExists(conditions);
  }

  async findByCredentials(conditions: { email: string; role: UserRoleEnum }): Promise<User | null> {
    return await this.repository.findByCredentials(conditions);
  }

  async create(data: Partial<User>, transaction: Transaction) {
    return await this.repository.create(data, transaction);
  }
}
