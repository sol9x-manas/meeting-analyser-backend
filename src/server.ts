import app from "./app";
import { AppDataSource } from "./config/database";
import { env } from "./config/env";

AppDataSource.initialize()
  .then(() => {
    console.log("Database connected");

    app.listen(env.port, () => {
      console.log(`Server running on port ${env.port}`);
    });
  })
  .catch((err) => {
    console.error("DB connection error:", err);
  });