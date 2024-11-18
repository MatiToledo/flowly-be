import { UUID } from "crypto";
import { Transaction } from "sequelize";
import { Auth } from "../model";
import { AuthRepository } from "./../interface/auth";
export class AuthRepositoryImpl implements AuthRepository {
  async create(data: Partial<Auth>, transaction?: Transaction): Promise<Auth> {
    try {
      return await Auth.create(data, {
        transaction,
      });
    } catch (error) {
      console.error(error);
      throw new Error(`NOT_CREATED`);
    }
  }

  async update(
    id: UUID,
    data: Partial<Auth>,
    transaction?: Transaction,
  ): Promise<{ affectedCount: number; affectedRows: Auth[] }> {
    try {
      const [affectedCount, affectedRows] = await Auth.update(data, {
        where: { id },
        transaction,
        returning: true,
      });
      return { affectedCount, affectedRows };
    } catch (error) {
      console.error(error);
      throw new Error(`NOT_UPDATED`);
    }
  }

  async findById(id: UUID, transaction?: Transaction): Promise<Auth> {
    throw new Error("Method not implemented.");
  }

  async delete(id: UUID, transaction?: Transaction): Promise<boolean> {
    try {
      const res = await Auth.destroy({
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
      throw new Error("NOT_DELETED");
    }
  }
}
