import { UUID } from "crypto";
import { DataTypes, Model } from "sequelize";
import { sequelize } from "../lib/db";

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
  },
  {
    sequelize,
    modelName: "Monitoring",
    timestamps: false,
    indexes: [{ fields: ["BranchId", "date", "hourIntervalStart"], unique: true }],
  },
);

export default Monitoring;
