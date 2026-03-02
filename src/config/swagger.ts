import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import { Express } from "express";

export const setupSwagger = (app: Express) => {
  const options = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Meeting Analyser API",
        version: "1.0.0",
      },
      components: {
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
          },
        },
      },
    },
    apis: ["src/modules/**/*.ts"],
  };

  const specs = swaggerJsdoc(options);

  // Custom UI Options for Swagger
  const uiOptions = {
    swaggerOptions: {
      tryItOutEnabled: true, // Baar-baar "Try it out" click karne se bachane ke liye
    },
    customCss: '.swagger-ui .topbar { display: none }', // Top header (Swagger logo/branding) hatane ke liye
    customSiteTitle: "Meeting Analyser API Docs" // Browser ke tab me "Swagger UI" ki jagah custom naam dikhane ke liye
  };

  // Setup function me uiOptions pass kar diya
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(specs, uiOptions));
};