// Environment variables load & validate
// 🔥 Clean
// 🔥 Type safe
// 🔥 Missing env immediately crash karega (good thing)

import dotenv from "dotenv";

dotenv.config();

function getEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
}

export const env = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: Number(process.env.PORT) || 5000,

  DB: {
    HOST: getEnv("DB_HOST"),
    PORT: Number(getEnv("DB_PORT")),
    USER: getEnv("DB_USER"),
    PASSWORD: getEnv("DB_PASSWORD"),
    NAME: getEnv("DB_NAME"),
  },

  JWT: {
    SECRET: getEnv("JWT_SECRET"),
    EXPIRES_IN: getEnv("JWT_EXPIRES_IN"),
  },
};