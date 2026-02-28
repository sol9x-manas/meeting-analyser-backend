import "reflect-metadata";
import "./container";

import { AppDataSource } from "./config/database/data-source";
import { appConfig } from "./config/app.config";
import { createApp } from "./app";

async function bootstrap() {
  try {
    // DB Initialize
    await AppDataSource.initialize();
    console.log("✅ Database connected");

    // Create Express App
    const app = createApp();

    // Start Server
    app.listen(appConfig.server.port, () => {
      console.log(
        `🚀 Server running on port ${appConfig.server.port}`
      );
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
}

bootstrap();