import { UUID } from "crypto";
import { DataTypes, Model } from "sequelize";
import { sequelize } from "../lib/db";
import { DateTime } from "luxon";

export enum MonitoringValuesEnum {
  EMPTY = "empty",
  FEW = "few",
  A_LOT = "aLot",
  TOO_MANY = "tooMany",
}

class Monitoring extends Model {
  declare id: number;
  declare branchId: number;
  declare date: string;
  declare peopleInBars: MonitoringValuesEnum;
  declare peopleInDance: MonitoringValuesEnum;
  declare hourIntervalStart: number;
  declare BranchId: UUID;
}

Monitoring.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    hourIntervalStart: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    peopleInBars: {
      type: DataTypes.ENUM,
      values: Object.values(MonitoringValuesEnum),
      allowNull: false,
    },
    peopleInDance: {
      type: DataTypes.ENUM,
      values: Object.values(MonitoringValuesEnum),
      allowNull: false,
    },
    sender: {
      type: DataTypes.VIRTUAL,
      get(this: Monitoring) {
        const user = this.getDataValue("User");
        return user ? `${user.fullName}` : null;
      },
    },
    timestamp: {
      type: DataTypes.VIRTUAL,
      get(this: Monitoring) {
        const hourIntervalStart = this.getDataValue("hourIntervalStart");
        const hours = Math.floor(hourIntervalStart);
        const minutes = hourIntervalStart % 1 === 0.5 ? 30 : 0;
        const time = DateTime.fromObject({ hour: hours, minute: minutes });
        return time.toFormat("HH:mm");
      },
    },
  },
  {
    sequelize,
    modelName: "Monitoring",
    indexes: [{ fields: ["BranchId", "date", "hourIntervalStart"], unique: true }],
  },
);

export default Monitoring;
