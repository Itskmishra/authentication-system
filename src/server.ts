// libs
import express, { Request, Response, NextFunction } from "express";
import http from "http";
import cookieParser from "cookie-parser";

// file's and utils.
import "./config/logging";
import { SERVER } from "./config/config";
import connect_db from "./config/db";
// swagger imports
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger";
// middlewares
import { loggingHandler } from "./middleware/logging.middleware";
import { corsHandler } from "./middleware/cors.middleware";
import { routeNotFound } from "./middleware/route.middleware";
// routes
import userRouter from "./routes/user.route";


// initializing
export const application = express();
export let httpServer: ReturnType<typeof http.createServer>;

// main function to setup and start server.
export const main = () => {
  logging.info("--------------------------------------------");
  logging.info("Initializing API");
  logging.info("--------------------------------------------");
  // utilities
  application.use(express.urlencoded({ extended: true }));
  application.use(express.json());

  logging.info("--------------------------------------------");
  logging.info("Logging & Configuration");
  logging.info("--------------------------------------------");
  // middlewares
  application.use(loggingHandler);
  application.use(corsHandler);
  application.use(cookieParser());
  application.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  logging.info("--------------------------------------------");
  logging.info("Define Controller Routing");
  logging.info("--------------------------------------------");
  // test route
  application.get(
    "/api/v1/test",
    (req: Request, res: Response, next: NextFunction) => {
      return res.status(200).json({ message: "Server is up and running." });
    }
  );
  application.use("/api/v1/user", userRouter);
  application.use(routeNotFound);

  logging.info("--------------------------------------------");
  logging.info("Connecting Database");
  logging.info("--------------------------------------------");
  connect_db();

  logging.info("--------------------------------------------");
  logging.info("Starting Server");
  logging.info("--------------------------------------------");
  httpServer = http.createServer(application);
  httpServer.listen(SERVER.SERVER_PORT, () => {
    logging.info("---------------------------------------------");
    logging.info(
      "Server Started: " + SERVER.SERVER_HOSTNAME + " : " + SERVER.SERVER_PORT
    );
    logging.info("---------------------------------------------");
  });
};
// simple shutdown function to stop server (mostly used by testin libs)
export const shutdown = (callback: any) =>
  httpServer && httpServer.close(callback);

// calling
main();
