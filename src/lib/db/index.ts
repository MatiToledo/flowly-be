import "dotenv/config";
import { Options, Sequelize } from "sequelize";

const testingEnv = process.env.NODE_ENV === "test";
console.log("process.env.NODE_ENV: ", process.env.NODE_ENV);

const prodEnv = process.env.NODE_ENV === "production" || process.env.NODE_ENV === "PRODUCTION";
console.log("prodEnv: ", prodEnv);

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
    statement_timeout: 150000,
    lock_timeout: 150000,
    iddle_in_transaction_session_timeout: 50000,
    useUTC: true,
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
  timezone: "UTC",
  logging: false,
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
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
