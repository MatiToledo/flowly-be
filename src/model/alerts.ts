import { UUID } from "crypto";
import { CreationOptional, DataTypes, Model } from "sequelize";
import { sequelize } from "../lib/db";
import { DateTime } from "luxon";

export enum AlertTypeEnum {
  DISTURBANCE_AT_BAR = "DISTURBANCE_AT_BAR",
  DISTURBANCE_AT_DOOR = "DISCONFORM_AT_DOOR",
  DRUNK_PERSON = "DRUNK_PERSON",
  REQUEST_ASSISTANCE = "REQUEST_ASSISTANCE",
  OVER_CAPACITY = "OVER_CAPACITY",
  EXCESSIVE_VOLUME = "EXCESSIVE_VOLUME",
  AUTHORITIES_INTERVENTION = "AUTHORITIES_INTERVENTION",
  ADDITIONAL_HELP = "ADDITIONAL_HELP",
  SUSPICIOUS_EMPLOYEE_BEHAVIOR = "SUSPICIOUS_EMPLOYEE_BEHAVIOR",
}

export class Alert extends Model {
  declare id: CreationOptional<UUID>;
  declare type: AlertTypeEnum;
  declare UserId: UUID;
  declare BranchId: UUID;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Alert.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    type: {
      type: DataTypes.ENUM,
      values: Object.values(AlertTypeEnum),
      allowNull: false,
    },
    sender: {
      type: DataTypes.VIRTUAL,
      get(this: Alert) {
        const user = this.getDataValue("User");
        return user ? `${user.fullName}` : null;
      },
    },
    timestamp: {
      type: DataTypes.VIRTUAL,
      get(this: Alert) {
        return DateTime.fromJSDate(this.getDataValue("createdAt")).toFormat("HH:mm");
      },
    },
  },
  {
    sequelize,
    modelName: "Alert",
  },
);
