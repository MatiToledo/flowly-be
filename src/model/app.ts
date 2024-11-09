import { DataTypes, Model } from "sequelize";
import { UUID } from "crypto";
import { sequelize } from "../lib/db/connect";

export class App extends Model {
  declare id: UUID;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

App.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
  },
  { sequelize, modelName: "App" },
);
