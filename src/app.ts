import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";

import { errorMiddleware } from "./middleware/error.middleware";
import { setupSwagger } from "./config/swagger";
import authRoutes from "./modules/auth/auth.route";
import userRoutes from "./modules/user/user.routes";

const app = express();

app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use(errorMiddleware);

setupSwagger(app);

export default app;