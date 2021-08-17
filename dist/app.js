"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const debug_1 = __importDefault(require("debug"));
const dotenv_1 = __importDefault(require("dotenv"));
const http = __importStar(require("http"));
const winston = __importStar(require("winston"));
const expressWinston = __importStar(require("express-winston"));
const auth_routes_config_1 = require("./auth/auth.routes.config");
const users_routes_config_1 = require("./users/users.routes.config");
const app = express_1.default();
const server = http.createServer(app);
const debugLog = debug_1.default("app");
const dotenvResult = dotenv_1.default.config();
const port = process.env.PORT || 3000;
const routes = [];
const runningMessage = `Server is up and running at http://localhost:${port}`;
if (dotenvResult.error) {
    throw dotenvResult.error;
}
const loggerOptions = {
    transports: [new winston.transports.Console()],
    format: winston.format.combine(winston.format.json(), winston.format.prettyPrint(), winston.format.colorize({ all: true })),
};
if (!process.env.DEBUG) {
    loggerOptions.meta = false;
    if (typeof global.it === "function") {
        loggerOptions.level = "http";
    }
}
app.use(express_1.default.json());
app.use(cors_1.default());
app.use(expressWinston.logger(loggerOptions));
routes.push(new users_routes_config_1.UsersRoutes(app));
routes.push(new auth_routes_config_1.AuthRoutes(app));
app.get("/", (req, res) => {
    res.status(200).send(runningMessage);
});
exports.default = server.listen(port, () => {
    routes.forEach((route) => {
        debugLog(`Routes configured for ${route.getName()}`);
    });
    console.log(runningMessage);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vYXBwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLHNEQUE4QjtBQUM5QixnREFBd0I7QUFDeEIsa0RBQTBCO0FBQzFCLG9EQUE0QjtBQUM1QiwyQ0FBNkI7QUFDN0IsaURBQW1DO0FBQ25DLGdFQUFrRDtBQUdsRCxrRUFBdUQ7QUFDdkQscUVBQTBEO0FBRTFELE1BQU0sR0FBRyxHQUF3QixpQkFBTyxFQUFFLENBQUM7QUFDM0MsTUFBTSxNQUFNLEdBQWdCLElBQUksQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDbkQsTUFBTSxRQUFRLEdBQW9CLGVBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUMvQyxNQUFNLFlBQVksR0FBRyxnQkFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDO0FBQ3JDLE1BQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQztBQUN0QyxNQUFNLE1BQU0sR0FBOEIsRUFBRSxDQUFDO0FBQzdDLE1BQU0sY0FBYyxHQUFHLGdEQUFnRCxJQUFJLEVBQUUsQ0FBQztBQUU5RSxJQUFJLFlBQVksQ0FBQyxLQUFLLEVBQUU7SUFDdEIsTUFBTSxZQUFZLENBQUMsS0FBSyxDQUFDO0NBQzFCO0FBRUQsTUFBTSxhQUFhLEdBQWlDO0lBQ2xELFVBQVUsRUFBRSxDQUFDLElBQUksT0FBTyxDQUFDLFVBQVUsQ0FBQyxPQUFPLEVBQUUsQ0FBQztJQUM5QyxNQUFNLEVBQUUsT0FBTyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQzVCLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLEVBQ3JCLE9BQU8sQ0FBQyxNQUFNLENBQUMsV0FBVyxFQUFFLEVBQzVCLE9BQU8sQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxDQUFDLENBQ3ZDO0NBQ0YsQ0FBQztBQUVGLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRTtJQUN0QixhQUFhLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQztJQUUzQixJQUFJLE9BQU8sTUFBTSxDQUFDLEVBQUUsS0FBSyxVQUFVLEVBQUU7UUFDbkMsYUFBYSxDQUFDLEtBQUssR0FBRyxNQUFNLENBQUM7S0FDOUI7Q0FDRjtBQUVELEdBQUcsQ0FBQyxHQUFHLENBQUMsaUJBQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO0FBQ3hCLEdBQUcsQ0FBQyxHQUFHLENBQUMsY0FBSSxFQUFFLENBQUMsQ0FBQztBQUNoQixHQUFHLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQztBQUU5QyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksaUNBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBQ2xDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSwrQkFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFFakMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFvQixFQUFFLEdBQXFCLEVBQUUsRUFBRTtJQUMzRCxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQztBQUN2QyxDQUFDLENBQUMsQ0FBQztBQUVILGtCQUFlLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRTtJQUN0QyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsS0FBeUIsRUFBRSxFQUFFO1FBQzNDLFFBQVEsQ0FBQyx5QkFBeUIsS0FBSyxDQUFDLE9BQU8sRUFBRSxFQUFFLENBQUMsQ0FBQztJQUN2RCxDQUFDLENBQUMsQ0FBQztJQUNILE9BQU8sQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLENBQUM7QUFDOUIsQ0FBQyxDQUFDLENBQUMifQ==