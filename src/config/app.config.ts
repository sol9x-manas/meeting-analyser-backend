// Application Level Configuration
// Ye app ke internal configuration hota hai.
// 
// 🎯 Isme kya rakhenge?
// 
// CORS settings
// API prefix
// Pagination defaults
// Rate limit config
// Swagger settings
// Upload size limits
// Cookie options
// 
// Ye pure application behavior define karta hai.

import { env } from "./env";

const isProduction = env.NODE_ENV === "production";

export const appConfig = {
  env: env.NODE_ENV,

  api: {
    prefix: "/api/v1",
  },

  server: {
    port: env.PORT,
  },

  cors: {
    origin: isProduction ? ["https://yourdomain.com"] : "*",
    credentials: true,
  },

  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 min
    max: isProduction ? 100 : 1000,
  },

  bodyParser: {
    jsonLimit: "10mb",
  },
};