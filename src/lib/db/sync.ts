import { sequelize } from "./connect";

const args = process.argv.slice(2);
const force = args.includes("--force");
const alter = args.includes("--alter");

if (force) {
  sequelize.sync({ force: true }).then(() => {
    console.log("Database synced with force");
  });
} else if (alter) {
  sequelize.sync({ alter: true }).then(() => {
    console.log("Database synced with alter");
  });
}
