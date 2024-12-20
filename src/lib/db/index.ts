import "dotenv/config";
import { Options, Sequelize } from "sequelize";

const {
  NODE_ENV,
  DB_HOST: host,
  DB_PORT: port,
  DB_USER: username,
  DB_PASSWORD: password,
  DB_NAME: database,
} = process.env;

const prodEnv = NODE_ENV === "production" || NODE_ENV === "PRODUCTION";

let config: Options = {
  dialect: "postgres",
  host,
  port: Number(port),
  username,
  password,
  database,
  timezone: "UTC",
  logging: false,
  dialectOptions: {
    ssl: false,
  },
};

if (prodEnv) {
  config = {
    ...config,
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
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  };
}

async function initDatabase() {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}

const sequelize = new Sequelize(config);

export { sequelize, initDatabase };
