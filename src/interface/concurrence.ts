import { UUID } from "crypto";
import { CrudRepository } from ".";
import { Concurrence } from "../model";

export interface ConcurrenceService {
  getByBranch(BranchId: UUID, date: string): Promise<Concurrence[]>;
  getActualByBranch(BranchId: UUID): Promise<ConcurrenceActualResponse>;
  getActualByBranchAndUser(BranchId: UUID, UserId: UUID): Promise<ConcurrenceActualResponse>;
  update(data: Partial<Concurrence>): Promise<any>;
}

export interface ConcurrenceRepository {
  getByBranch(BranchId: UUID, date: string): Promise<Concurrence[]>;
  getActualByBranch(BranchId: UUID, date: string): Promise<Concurrence[]>;
  getActualByBranchAndUser(BranchId: UUID, UserId: UUID, date: string): Promise<Concurrence[]>;
  findOrCreate(conditions: Partial<Concurrence>): Promise<Concurrence>;
  getTotalByBranchId(BranchId: UUID, date: string): Promise<number>;
}

export interface ConcurrenceActualResponse {
  total: number;
  entries: number;
  exits: number;
  totalBranch: number;
}
