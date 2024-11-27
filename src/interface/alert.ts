import { CrudRepository } from ".";
import { Alert } from "../model";

export interface AlertService {}

export interface AlertRepository extends CrudRepository<Alert> {}
