import { Sequelize } from "sequelize";
import { config } from "../../config";

export const sequelize = new Sequelize(
  config.db.name!,
  config.db.user!,
  config.db.password,
  {
    host: config.db.host!,
    dialect: "postgres",
    port: Number(process.env.DB_PORT) ?? 5431,
    logging: true,
  },
);
