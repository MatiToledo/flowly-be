import { Transaction } from "sequelize";
import { UserBranchService } from "../interface/userBranch";
import { UserBranch } from "../model";
import { UserBranchRepositoryImpl } from "../repository/userBranch";
export class UserBranchServiceImpl implements UserBranchService {
  private repository = new UserBranchRepositoryImpl();

  async create(data: Partial<UserBranch>, transaction: Transaction) {
    return await this.repository.create(data, transaction);
  }
}
