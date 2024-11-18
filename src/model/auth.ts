import { UUID } from "crypto";
import { CreationOptional, DataTypes, Model } from "sequelize";
import { sequelize } from "../lib/db";

export class Auth extends Model {
  declare id: CreationOptional<UUID>;
  declare email: string;
  declare password: string;
  declare newPassword: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Auth.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Auth",
  },
);
