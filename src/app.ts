import express from "express";
import cors from "cors";
import { appConfig } from "./config/app.config";
import authRoutes from "./modules/auth/presentation/routes/auth.routes";
import { errorHandler } from "./shared/middleware/error-handler.middleware";
import { setupSwagger } from "./config/docs/swagger";

export function createApp() {
  const app = express();

  // Middlewares
  app.use(cors(appConfig.cors));
  app.use(express.json({ limit: appConfig.bodyParser.jsonLimit }));

  // Routes
  app.use(appConfig.api.prefix + "/auth", authRoutes);

  app.use(errorHandler);
  setupSwagger(app);
  return app;
}