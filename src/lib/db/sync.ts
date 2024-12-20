import { UserBranchService } from "./../../interface/userBranch";
import "../../model";
import { sequelize } from ".";
import { AuthServiceImpl } from "../../service/auth";
import { UserRoleEnum, UserSubRoleEnum } from "../../model/user";
import { UserBranchServiceImpl } from "../../service/userBranch";
import { BranchServiceImpl } from "../../service/branch";
import { Concurrence } from "../../model";
import { DateTime } from "luxon";
import Monitoring from "../../model/monitoring";
import { Alert, AlertTypeEnum } from "../../model/alerts";
const authService = new AuthServiceImpl();
const userBranchService = new UserBranchServiceImpl();
const branchService = new BranchServiceImpl();
const args = process.argv.slice(2);
const force = args.includes("--force");
const alter = args.includes("--alter");

if (force) {
  sequelize.sync({ force: true }).then(async () => {
    await createDevData();
    console.log("Database synced with force");
  });
} else if (alter) {
  sequelize.sync({ alter: true }).then(async () => {
    // await createDevData();
    console.log("Database synced with alter");
  });
}

async function createDevData() {
  const transaction = await sequelize.transaction();
  try {
    const admin = await authService.logUp(
      {
        Auth: {
          email: "mati@gmail.com",
          password: "123123123",
        },
        User: {
          fullName: "Matias Toledo",
          email: "mati@gmail.com",
          role: UserRoleEnum.PARTNER,
          subRole: UserSubRoleEnum.ADMIN,
        },
        Branch: {
          timeZone: "America/Argentina/Buenos_Aires",
          name: "Bottom",
          maxCapacity: 300,
          opening: "21:00",
          closing: "05:00",
          profitPerPerson: 10000,
        },
      },
      transaction,
    );
    const userBranch = await userBranchService.findAllByUserId(admin.id, transaction);
    const branch = await branchService.findById(userBranch[0].BranchId, transaction);
    const guardDoor = await authService.logUp(
      {
        Auth: {
          email: "lucas@gmail.com",
          password: "123123123",
        },
        User: {
          fullName: "Lucas Ruiz",
          email: "lucas@gmail.com",
          role: UserRoleEnum.USER,
          subRole: UserSubRoleEnum.GUARD_DOOR,
        },
        Branch: {
          id: branch.id,
        },
      },
      transaction,
    );
    const guardBar = await authService.logUp(
      {
        Auth: {
          email: "fache@gmail.com",
          password: "123123123",
        },
        User: {
          fullName: "Tobias Facello",
          email: "fache@gmail.com",
          role: UserRoleEnum.USER,
          subRole: UserSubRoleEnum.GUARD_BAR,
        },
        Branch: {
          id: branch.id,
        },
      },
      transaction,
    );
    const concurrencesHours = [21, 22, 23, 0, 1, 2, 3, 4];
    const monitoringsHours = [21, 21.5, 22, 22.5, 23, 23.5, 0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5];

    // Lógica para ajustar las fechas
    const dates = [
      DateTime.now().minus({ days: 1 }).toFormat("yyyy-MM-dd"),
      DateTime.now().minus({ days: 2 }).toFormat("yyyy-MM-dd"),
      DateTime.now().minus({ days: 3 }).toFormat("yyyy-MM-dd"),
    ];

    for (const hour of concurrencesHours) {
      for (const date of dates) {
        const entries = Math.floor(Math.random() * 100) + 1;
        let exits = Math.floor(Math.random() * 100) + 1;
        if (exits > entries) {
          exits = entries; // Ajustar exits al valor máximo permitido
        }
        const paid = Math.floor(entries * 0.55);
        const free = Math.floor(entries * 0.1);
        const qr = Math.floor(entries * 0.1);
        const guests = Math.floor(entries * 0.15);
        const vip = entries - (paid + free + qr + guests);

        await Concurrence.create(
          {
            date,
            hourIntervalStart: hour,
            entries,
            exits,
            paid,
            free,
            qr,
            guests,
            vip,
            UserId: guardDoor.id,
            BranchId: branch.id,
          },
          { transaction },
        );
      }
    }
    for (const hour of monitoringsHours) {
      for (const date of dates) {
        const values = {
          0: "empty",
          1: "few",
          2: "aLot",
          3: "tooMany",
        };
        const peopleInBars = values[Math.floor(Math.random() * 4)];
        const peopleInDance = values[Math.floor(Math.random() * 4)];

        await Monitoring.create(
          {
            date,
            hourIntervalStart: hour,
            peopleInBars,
            peopleInDance,
            BranchId: branch.id,
          },
          { transaction },
        );
      }
    }
    for (const alert of Object.values(AlertTypeEnum)) {
      Alert.create({
        type: alert,
        BranchId: branch.id,
        UserId: guardDoor.id,
      });
    }

    await transaction.commit();
    console.log("Development data created successfully");
  } catch (error) {
    await transaction.rollback();
    console.error("Error creating development data:", error);
  }
}
