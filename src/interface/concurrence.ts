import { CrudRepository } from ".";
import { Concurrence } from "../model";

export interface ConcurrenceService {}

export interface ConcurrenceRepository extends CrudRepository<Concurrence> {}
