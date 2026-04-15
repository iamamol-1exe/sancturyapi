"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequelize = void 0;
const sequelize_1 = require("sequelize");
const config_1 = require("../../config");
exports.sequelize = new sequelize_1.Sequelize(config_1.config.db.name, config_1.config.db.user, config_1.config.db.password, {
    host: config_1.config.db.host,
    dialect: "postgres",
    port: Number(process.env.DB_PORT) ?? 5431,
    logging: true,
});
//# sourceMappingURL=postgres.js.map