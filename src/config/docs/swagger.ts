import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";

export function setupSwagger(app: Express) {
  const options: swaggerJsdoc.Options = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "SOL9X Meeting Analyzer API",
        version: "1.0.0",
        description: "API documentation for SOL9X backend",
      },
      servers: [
        {
          url: "http://localhost:3000",
        },
      ],
    },
    apis: ["./src/modules/**/presentation/routes/*.ts"], // ONLY presentation layer
  };

  const specs = swaggerJsdoc(options);

  app.use("/docs", swaggerUi.serve, swaggerUi.setup(specs));
}