import { CrudRepository } from ".";
import { UserBranch } from "../model";

export interface UserBranchService {}

export interface UserBranchRepository extends CrudRepository<UserBranch> {}
