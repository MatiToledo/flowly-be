import { CrudRepository } from ".";
import { Branch } from "../model";

export interface BranchService {}

export interface BranchRepository extends CrudRepository<Branch> {}
