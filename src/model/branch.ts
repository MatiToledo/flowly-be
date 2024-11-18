import { UUID } from "crypto";
import { CreationOptional, DataTypes, Model } from "sequelize";
import { sequelize } from "../lib/db";

export class Branch extends Model {
  declare id: CreationOptional<UUID>;
  declare name: string;
  declare maxCapacity: number;
  declare timeZone: string;
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
      allowNull: true,
    },
    timeZone: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "America/Argentina/Buenos_Aires",
    },
  },
  {
    sequelize,
    modelName: "Branch",
  },
);
