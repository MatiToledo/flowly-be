import { Transaction } from "sequelize";
import { CrudRepository } from ".";
import { Message } from "../model";
import { UUID } from "crypto";
export interface MessageService {}

export interface MessageRepository extends CrudRepository<Message> {}
