import express from "express";
import cors from "cors";
import debug from "debug";
import dotenv from "dotenv";
import helment from 'helmet';

import * as http from "http";
import * as winston from "winston";
import * as expressWinston from "express-winston";

import { CommonRoutesConfig } from "./common/common.routes.config";
import { AuthRoutes } from "./auth/auth.routes.config";
import { UsersRoutes } from "./users/users.routes.config";

const app: express.Application = express();
const server: http.Server = http.createServer(app);
const debugLog: debug.IDebugger = debug("app");
const port = process.env.PORT || 3000;
const routes: Array<CommonRoutesConfig> = [];
const runningMessage = `Server is up and running at http://localhost:${port}`;

const loggerOptions: expressWinston.LoggerOptions = {
  transports: [new winston.transports.Console()],
  format: winston.format.combine(
    winston.format.json(),
    winston.format.prettyPrint(),
    winston.format.colorize({ all: true })
  ),
};

if (!process.env.DEBUG) {
  loggerOptions.meta = false;

  if (typeof global.it === "function") {
    loggerOptions.level = "http";
  }
}

dotenv.config();
app.use(express.json());
app.use(cors());
app.use(helment());
app.use(expressWinston.logger(loggerOptions));

routes.push(new UsersRoutes(app));
routes.push(new AuthRoutes(app));

app.get("/", (req: express.Request, res: express.Response) => {
  res.status(200).send(runningMessage);
});

export default server.listen(port, () => {
  routes.forEach((route: CommonRoutesConfig) => {
    debugLog(`Routes configured for ${route.getName()}`);
  });
  console.log(runningMessage);
});
