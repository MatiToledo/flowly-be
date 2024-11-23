import { UUID } from "crypto";
import { DataTypes, Model } from "sequelize";
import { sequelize } from "../lib/db";

export enum EntranceTypeEnum {
  PAID = "paid",
  FREE = "free",
  QR = "qr",
  VIP = "vip",
  GUEST = "guests",
}

class Concurrence extends Model {
  declare id: number;
  declare branchId: number;
  declare date: string;
  declare type: "entry" | "exit";
  declare hourIntervalStart: number; // Hora de inicio del intervalo (e.g., 21)
  declare BranchId: UUID;
  declare entries: number;
  declare exits: number;
  declare UserId: UUID;
  declare entranceType: EntranceTypeEnum;
}

Concurrence.init(
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
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    entries: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
    exits: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
    paid: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
    free: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
    qr: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
    vip: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
    guests: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Concurrence",
    timestamps: false,
    indexes: [{ fields: ["BranchId", "date", "hourIntervalStart", "UserId"], unique: true }],
  },
);

export default Concurrence;
