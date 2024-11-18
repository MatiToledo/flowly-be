import { CrudRepository } from ".";
import { User } from "../model";

export interface UserService {}

export interface UserRepository extends CrudRepository<User> {}
