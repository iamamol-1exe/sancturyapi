"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __importDefault(require("./index"));
const http_1 = __importDefault(require("http"));
const postgres_1 = require("./infra/db/postgres");
const config_1 = require("./config");
const httpServer = http_1.default.createServer(index_1.default);
const startSever = async () => {
    try {
        try {
            await postgres_1.sequelize.authenticate();
            console.log("Connection has been established successfully.");
        }
        catch (error) {
            console.error("Unable to connect to the database:", error);
        }
        httpServer.listen(config_1.config.base.port, () => {
            console.log("Server is started succesfully");
        });
    }
    catch (error) {
        console.error(error?.message);
    }
};
startSever();
//# sourceMappingURL=server.js.map