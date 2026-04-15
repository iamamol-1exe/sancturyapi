import app from "./index";
import http from "http";
import { sequelize } from "./infra/db/postgres";
import { config } from "./config";
import "./infra/models";
import redisClient from "./infra/redis";

const httpServer = http.createServer(app);
let isShuttingDown = false;

const shutdown = async (signal: string) => {
  if (isShuttingDown) {
    return;
  }
  isShuttingDown = true;

  console.log(`Received ${signal}. Starting graceful shutdown...`);

  httpServer.close(async (closeErr) => {
    if (closeErr) {
      console.error("Error closing HTTP server:", closeErr);
      process.exit(1);
      return;
    }

    try {
      await sequelize.close();

      console.log("Database connection closed.");
    } catch (dbErr) {
      console.error("Error closing database connection:", dbErr);
      process.exit(1);
      return;
    }
    try {
      await redisClient.quit();
      console.log("Redis connection closed.");
    } catch (redErr) {
      console.error("Error closing redis connection:", redErr);
      process.exit(1);
      return;
    }

    console.log("Shutdown complete.");
    process.exit(0);
  });

  setTimeout(() => {
    console.error("Forced shutdown after timeout.");
    process.exit(1);
  }, 10000).unref();
};

const startSever = async () => {
  try {
    try {
      await sequelize.authenticate();
      console.log("Connection has been established successfully.");
    } catch (error) {
      console.error("Unable to connect to the database:", error);
    }

    await redisClient.connect();

    httpServer.listen(config.base.port, () => {
      console.log("Server is started succesfully", config.base.port);
    });
    process.on("SIGTERM", async () => {
      console.log("SIGTERM received, shutting down gracefully...");
      httpServer.close();
      await sequelize.close();
      process.exit(0);
    });
  } catch (error: any) {
    console.error(error?.message);
  }
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

startSever();
