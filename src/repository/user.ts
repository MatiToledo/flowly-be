import { UUID } from "crypto";
import { Op, Sequelize, Transaction } from "sequelize";
import { UserRoleEnum } from "../model/user";
import { UserRepository } from "../interface/user";
import { Auth, Branch, User } from "../model";
export class UserRepositoryImpl implements UserRepository {
  async throwIfAlreadyExists(conditions: { email: string; role: UserRoleEnum }): Promise<void> {
    try {
      const exists = await User.findOne({
        where: { ...conditions },
        include: [Auth],
      });
      if (exists) {
        const error = new Error();
        throw error;
      }
    } catch (error) {
      if (error.message) {
        throw new Error("USER_NOT_FOUND");
      }
      throw new Error("USER_EMAIL_ALREADY_EXISTS");
    }
  }

  async findByCredentials(conditions: { email: string; role: UserRoleEnum }): Promise<User> {
    try {
      const exists = await User.findOne({
        where: { ...conditions },
        include: [Auth, Branch],
      });
      if (!exists) {
        throw new Error();
      }
      return exists;
    } catch (error) {
      if (error.message) {
        throw new Error("USER_NOT_FOUND");
      }
      throw new Error("USER_CREDENTIALS_NOT_FOUND");
    }
  }

  async deleteUsersFromBranch(BranchId: UUID, transaction: Transaction): Promise<void> {
    try {
      await User.destroy({
        where: {
          BranchId,
        },
        transaction,
      });
    } catch (error) {
      console.error(error);
      throw new Error(`USER_NOT_DELETED`);
    }
  }

  async create(data: Partial<User>, transaction?: Transaction): Promise<User> {
    try {
      return await User.create(data, {
        transaction,
      });
    } catch (error) {
      console.error(error);
      throw new Error(`USER_NOT_CREATED`);
    }
  }

  async update(
    id: UUID,
    data: Partial<User>,
    transaction: Transaction,
  ): Promise<{ affectedCount: number; affectedRows: User[] }> {
    try {
      const [affectedCount, affectedRows] = await User.update(data, {
        where: { id },
        transaction,
        returning: true,
      });
      if (data.email) {
        await Auth.update({ email: data.email }, { where: { id: affectedRows[0].AuthId } });
      }
      return { affectedCount, affectedRows };
    } catch (error) {
      console.error(error);
      throw new Error(`USER_NOT_UPDATED`);
    }
  }

  async findByIdWithAuth(id: UUID, transaction?: Transaction): Promise<User> {
    try {
      return await User.findByPk(id, { include: [Auth], transaction });
    } catch (error) {
      console.error(error);
      throw new Error("USER_NOT_FOUND");
    }
  }
  async findById(id: UUID, transaction?: Transaction): Promise<User> {
    try {
      return await User.findByPk(id, {
        include: [{ model: Branch, include: [User] }],
        transaction,
      });
    } catch (error) {
      console.error(error);
      throw new Error("USER_NOT_FOUND");
    }
  }

  async delete(id: UUID, transaction?: Transaction): Promise<boolean> {
    try {
      const res = await User.destroy({
        where: { id },
        transaction,
      });
      if (res > 0) {
        return true;
      } else {
        throw new Error();
      }
    } catch (error) {
      console.error(error);
      throw new Error("USER_NOT_DELETED");
    }
  }
}
