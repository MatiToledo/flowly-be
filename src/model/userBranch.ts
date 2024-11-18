import { Model, DataTypes, CreationOptional } from "sequelize";
import { UUID } from "crypto";
import { sequelize } from "../lib/db";

export class UserBranch extends Model {
  declare id: CreationOptional<UUID>;
  declare UserId: UUID;
  declare BranchId: UUID;
}

UserBranch.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    UserId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    BranchId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "UserBranch",
    timestamps: false,
  },
);
