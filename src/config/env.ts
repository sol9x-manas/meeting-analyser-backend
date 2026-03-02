import dotenv from "dotenv";

dotenv.config();

export const env = {
  port: process.env.PORT || 5000,
  db: {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  },
  jwtSecret: process.env.JWT_SECRET as string,
  accessTokenExpiry: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN as string,
  refreshTokenExpiry: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN as string,
};