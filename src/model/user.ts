import { Branch } from "./branch";
import { UUID } from "crypto";
import { BelongsToManyAddAssociationMixin, CreationOptional, DataTypes, Model } from "sequelize";
import { Auth } from "./auth";
import { sequelize } from "../lib/db";

export enum UserRoleEnum {
  USER = "user",
  PARTNER = "partner",
}
export enum UserSubRoleEnum {
  GUARD_BAR = "guardBar",
  GUARD_DOOR = "guardDoor",
  ADMIN = "admin",
  PARTNER = "partner",
}
export class User extends Model {
  declare id: CreationOptional<UUID>;
  declare fullName: string;
  declare email: string;
  declare role: UserRoleEnum;
  declare subRole: UserSubRoleEnum;
  declare Branches: Branch[];
  declare BranchId: UUID;
  declare AuthId: UUID;
  declare Auth: Auth;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM,
      values: Object.values(UserRoleEnum),
      allowNull: false,
    },
    subRole: {
      type: DataTypes.ENUM,
      values: Object.values(UserSubRoleEnum),
      allowNull: false,
      validate: {
        isValidSubRole(value: string) {
          if (this.role === UserRoleEnum.USER) {
            if (
              ![UserSubRoleEnum.GUARD_BAR, UserSubRoleEnum.GUARD_DOOR].includes(
                value as UserSubRoleEnum,
              )
            ) {
              throw new Error("Invalid subRole for USER role. Must be 'guardBar' or 'guardDoor'.");
            }
          } else if (this.role === UserRoleEnum.PARTNER) {
            if (
              ![UserSubRoleEnum.PARTNER, UserSubRoleEnum.ADMIN].includes(value as UserSubRoleEnum)
            ) {
              throw new Error("Invalid subRole for PARTNER role. Must be 'partner' or 'admin'.");
            }
          } else {
            throw new Error("Invalid role.");
          }
        },
      },
    },
  },
  {
    sequelize,
    modelName: "User",
  },
);
