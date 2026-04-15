import app from "./index";
import http from "http";
import { sequelize } from "./infra/db/postgres";
import { config } from "./config";
import "./infra/models";

const httpServer = http.createServer(app);

const startSever = async () => {
  try {
    try {
      await sequelize.authenticate();
      console.log("Connection has been established successfully.");
    } catch (error) {
      console.error("Unable to connect to the database:", error);
    }
    httpServer.listen(config.base.port, () => {
      console.log("Server is started succesfully",config.base.port);
    });
  } catch (error: any) {
    console.error(error?.message);
  }
};

startSever();
