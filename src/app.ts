import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import { errorMiddleware } from "./middleware/error.middleware";
import { setupSwagger } from "./config/swagger";
import authRoutes from "./modules/auth/auth.route";

const app = express();

app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

app.use("/api/auth", authRoutes);

app.use(errorMiddleware);

setupSwagger(app);

export default app;