import { UUID } from "crypto";
import { CreationOptional, DataTypes, Model } from "sequelize";
import { sequelize } from "../lib/db";

export class Branch extends Model {
  declare id: CreationOptional<UUID>;
  declare name: string;
  declare maxCapacity: number;
  declare timeZone: string;
  declare opening: string;
  declare closing: string;
  declare profitPerPerson: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Branch.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    maxCapacity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    profitPerPerson: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    timeZone: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "America/Argentina/Buenos_Aires",
    },
    opening: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    closing: {
      type: DataTypes.TIME,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Branch",
  },
);
