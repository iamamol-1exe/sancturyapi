"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
exports.config = {
    db: {
        user: process.env.DB_USER,
        name: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
    },
    base: {
        port: process.env.PORT ?? 4001,
        enviroment: process.env.NODE_ENV,
    },
};
//# sourceMappingURL=index.js.map