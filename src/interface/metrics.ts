import { UUID } from "crypto";

export interface MetricsService {
  getByBranch(BranchId: UUID, queries: any): Promise<any>;
}
