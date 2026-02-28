import "reflect-metadata";
import { DataSource } from "typeorm";
import { env } from "../env";

export const AppDataSource = new DataSource({
    type: "mysql",

    host: env.DB.HOST,
    port: Number(env.DB.PORT),
    username: env.DB.USER,
    password: env.DB.PASSWORD,
    database: env.DB.NAME,

    synchronize: false,

    logging: env.NODE_ENV !== "production",

    entities: [__dirname + "/../../modules/**/infrastructure/orm/*.{ts,js}"],

    migrations: [__dirname + "/migrations/*.{ts,js}"],

    subscribers: [],
});