import { UUID } from "crypto";
import { CreationOptional, DataTypes, Model, Sequelize } from "sequelize";
import { sequelize } from "../lib/db";
import { User } from "./user";

export class Message extends Model {
  declare id: CreationOptional<UUID>;
  declare text: string;
  declare sender: string;
  declare isYou: boolean;
  declare UserId: UUID;
  declare User: User;
  declare BranchId: UUID;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Message.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    text: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Message",
  },
);
