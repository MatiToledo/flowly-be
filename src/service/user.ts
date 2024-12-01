import { UUID } from "crypto";
import { Transaction } from "sequelize";
import { UserService } from "../interface/user";
import { User, UserRoleEnum, UserSubRoleEnum } from "../model/user";
import { UserRepositoryImpl } from "../repository/user";
import { UserBranchServiceImpl } from "./userBranch";

export class UserServiceImpl implements UserService {
  private repository = new UserRepositoryImpl();
  private userBranchService = new UserBranchServiceImpl();

  async delete(UserId: UUID, transaction: Transaction): Promise<void> {
    const userToDelete = await this.findById(UserId);

    if (userToDelete.subRole === UserSubRoleEnum.ADMIN) {
      for (const branch of userToDelete.Branches) {
        await this.deleteUsersFromBranch(branch.id, UserId, transaction);
        branch.destroy({ transaction });
      }
    }
    await userToDelete.destroy({ transaction });
  }

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

  async throwIfAlreadyExists(conditions: { email: string; role: UserRoleEnum }): Promise<void> {
    await this.repository.throwIfAlreadyExists(conditions);
  }

  async deleteUsersFromBranch(BranchId: UUID, UserId: UUID, transaction: Transaction) {
    const usersToDelete = await this.userBranchService.findAllByBranchId(BranchId, transaction);
    const excludeMe = usersToDelete.filter((userBranch) => userBranch.UserId !== UserId);
    for (const user of excludeMe) {
      await this.repository.delete(user.UserId, transaction);
      user.destroy({ transaction });
    }
  }

  async findByCredentials(conditions: { email: string; role: UserRoleEnum }): Promise<User | null> {
    return await this.repository.findByCredentials(conditions);
  }

  async create(data: Partial<User>, transaction: Transaction): Promise<User> {
    return await this.repository.create(data, transaction);
  }
}
