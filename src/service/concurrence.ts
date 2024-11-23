import { DateTime } from "luxon";
import { ConcurrenceService } from "../interface/concurrence";
import { Concurrence } from "../model";
import { ConcurrenceRepositoryImpl } from "../repository/concurrence";
import { BranchServiceImpl } from "./branch";
import { UUID } from "crypto";
import { getDateToQuery, getLocalISODate } from "../utils/luxon";
export class ConcurrenceServiceImpl implements ConcurrenceService {
  private repository = new ConcurrenceRepositoryImpl();
  private branchService = new BranchServiceImpl();

  async getActualByBranchId(BranchId: UUID, UserId: UUID) {
    const branch = await this.branchService.findById(BranchId);
    // const isBranchOpen = this.branchService.checkIfIsOpen(branch);

    // if (!isBranchOpen) {
    //   return { total: 0, entries: 0, exits: 0, totalConcurrence: 0 };
    // }

    const { date, hourIntervalStart } = getDateToQuery(branch);
    console.log("hourIntervalStart: ", hourIntervalStart);
    console.log("date: ", date);
    // console.log("date: ", date);

    // const concurrences = await this.repository.getActualByBranchAndUser(BranchId, UserId, date);
    // console.log("concurrences: ", concurrences);
    // const totalConcurrence = await this.repository.getTotalByBranchId(BranchId, date);

    // return concurrences.reduce(
    //   (acc, concurrence) => {
    //     acc.total += concurrence.entries - concurrence.exits;
    //     acc.entries += concurrence.entries;
    //     acc.exits += concurrence.exits;
    //     return acc;
    //   },
    //   {
    //     total: 0,
    //     entries: 0,
    //     exits: 0,
    //     totalConcurrence,
    //   },
    // );
  }

  async update(data: Partial<Concurrence>): Promise<any> {
    const { BranchId, type, entranceType, UserId } = data;
    const branch = await this.branchService.findById(BranchId);
    const { opening, closing, timeZone } = branch;

    const isBranchOpen = this.branchService.checkIfIsOpen(branch);

    if (!isBranchOpen) {
      throw new Error("La sucursal está cerrada");
    }

    const { date, hourIntervalStart } = this.getAdjustedDateForBranch(opening, closing, timeZone);
    console.log("hourIntervalStart: ", hourIntervalStart);

    const concurrence = await this.repository.findOrCreate({
      BranchId,
      date,
      hourIntervalStart,
      UserId,
    });

    if (type === "entry") {
      concurrence.entries += 1;
    } else if (type === "exit") {
      concurrence.exits += 1;
    }

    if (entranceType) {
      concurrence[entranceType] += 1;
    } else {
      concurrence["paid"] += 1;
    }

    await concurrence.save();

    const totalBranch = await this.repository.getTotalByBranchId(BranchId, date);

    return { ...concurrence.dataValues, totalBranch };
  }

  getAdjustedDateForBranch(
    opening: string,
    closing: string,
    timeZone: string,
  ): { date: string; hourIntervalStart: number } {
    const nowUtc = DateTime.utc();
    const localTime = nowUtc.setZone(timeZone);
    const hourIntervalStart = localTime.hour;
    console.log("hourIntervalStart: ", hourIntervalStart);

    const openingHour = parseInt(opening.split(":")[0], 10);
    const closingHour = parseInt(closing.split(":")[0], 10);

    let date = localTime.toISODate();

    const branchHoursPassMidnight = closingHour < openingHour;
    // Si el horario de cierre es menor que el horario de apertura, significa que cruza medianoche
    if (branchHoursPassMidnight) {
      console.log("PASA MEDIANOCHE");

      // Ajustamos si estamos antes de la apertura o después del cierre
      if (hourIntervalStart < openingHour && hourIntervalStart >= closingHour) {
        console.log("ES MEDIANOCHE");
        date = localTime.minus({ days: 1 }).toISODate(); // Ajustamos al día anterior
      }
    } else {
      console.log("NO PASA MEDIANOCHE");
      // Caso normal donde el horario no cruza medianoche
      if (hourIntervalStart < openingHour || hourIntervalStart >= closingHour) {
        date = localTime.minus({ days: 1 }).toISODate(); // Ajustamos al día anterior
      }
    }

    return { date, hourIntervalStart };
  }
}
