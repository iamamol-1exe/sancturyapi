import dotenv from "dotenv";

dotenv.config();

export const config = {
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
    secret: process.env.SECRET ?? "amold",
  },
  oauth: {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    authUri: process.env.AUTH_URI,
    tokenUri: process.env.AUTH_TOKENURI,
    certUri: process.env.AUTH_CERT,
    callback:
      process.env.GOOGLE_CALLBACK_URL ??
      process.env.CALLBACK ??
      "http://localhost:4001/api/v1/auth/google/callback",
  },
};
