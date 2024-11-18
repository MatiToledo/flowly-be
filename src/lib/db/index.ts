import "dotenv/config";
import { Options, Sequelize } from "sequelize";

const testingEnv = process.env.NODE_ENV === "test";
const prodEnv = process.env.NODE_ENV === "production" || process.env.NODE_ENV === "PRODUCTION";

const devConfig: Options = {
  dialect: "postgres",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: testingEnv ? process.env.DB_TEST_NAME : process.env.DB_NAME,
  dialectOptions: {
    ssl: false,
  },
  timezone: "UTC",
  logging: false,
};

const prodConfig: Options = {
  dialect: "postgres",
  host: process.env.DB_PROD_HOST,
  port: Number(process.env.DB_PROD_PORT),
  username: process.env.DB_PROD_USER,
  password: process.env.DB_PROD_PASSWORD,
  database: process.env.DB_PROD_NAME,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
  timezone: "UTC",
  logging: false,
};

async function initDatabase() {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}

const sequelize = new Sequelize(prodEnv ? prodConfig : devConfig);

export { sequelize, initDatabase };
