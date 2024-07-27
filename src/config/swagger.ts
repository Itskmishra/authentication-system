import swaggerJsdoc from "swagger-jsdoc";
import { SERVER } from "./config";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Authentication API",
      version: "1.0.0",
      description:
        "API documentation for Authentication Express TypeScript server",
    },
    servers: [
      {
        url: `http://${SERVER.SERVER_HOSTNAME}:${SERVER.SERVER_PORT}`,
        description: "Development server",
      },
    ],
  },
  apis: ["./src/routes/*.ts"],
};

export const swaggerSpec = swaggerJsdoc(options);
