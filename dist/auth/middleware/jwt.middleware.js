"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_1 = __importDefault(require("crypto"));
const users_service_1 = __importDefault(require("../../users/services/users.service"));
const jwtSecret = `${process.env.JWT_SECRET}`;
class JwtMiddleware {
    verifyRefreshBodyField(req, res, next) {
        if (req.body && req.body.refreshToken) {
            return next();
        }
        return res
            .status(400)
            .send({ errors: ["Missing required field: refreshToken"] });
    }
    validRefreshNeeded(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield users_service_1.default.getUserByEmailWithPassword(res.locals.jwt.email);
            const salt = crypto_1.default.createSecretKey(Buffer.from(res.locals.jwt.refreshKey.data));
            const hash = crypto_1.default
                .createHmac("sha512", salt)
                .update(res.locals.jwt.userId + jwtSecret)
                .digest("base64");
            if (hash === req.body.refreshToken) {
                const { _id, email, permissionLevel } = user;
                req.body = {
                    userId: _id,
                    email,
                    permissionLevel,
                };
                return next();
            }
            return res.status(400).send({ errors: ["Invalid refresh token"] });
        });
    }
    validJWTNeeded(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            if (req.headers["authorization"]) {
                try {
                    const authorization = req.headers["authorization"].split(" ");
                    if (authorization[0] !== "Bearer") {
                        return res.status(400).send();
                    }
                    res.locals.jwt = jsonwebtoken_1.default.verify(authorization[1], jwtSecret);
                    next();
                }
                catch (err) {
                    return res.status(403).send();
                }
            }
            else {
                return res.status(401).send();
            }
        });
    }
}
exports.default = new JwtMiddleware();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiand0Lm1pZGRsZXdhcmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9hdXRoL21pZGRsZXdhcmUvand0Lm1pZGRsZXdhcmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFDQSxnRUFBK0I7QUFDL0Isb0RBQTRCO0FBRTVCLHVGQUE4RDtBQUc5RCxNQUFNLFNBQVMsR0FBVyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBVSxFQUFFLENBQUM7QUFFdEQsTUFBTSxhQUFhO0lBQ2pCLHNCQUFzQixDQUNwQixHQUFvQixFQUNwQixHQUFxQixFQUNyQixJQUEwQjtRQUUxQixJQUFJLEdBQUcsQ0FBQyxJQUFJLElBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUU7WUFDckMsT0FBTyxJQUFJLEVBQUUsQ0FBQztTQUNmO1FBQ0QsT0FBTyxHQUFHO2FBQ1AsTUFBTSxDQUFDLEdBQUcsQ0FBQzthQUNYLElBQUksQ0FBQyxFQUFFLE1BQU0sRUFBRSxDQUFDLHNDQUFzQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQ2hFLENBQUM7SUFFSyxrQkFBa0IsQ0FDdEIsR0FBb0IsRUFDcEIsR0FBcUIsRUFDckIsSUFBMEI7O1lBRTFCLE1BQU0sSUFBSSxHQUFRLE1BQU0sdUJBQVksQ0FBQywwQkFBMEIsQ0FDN0QsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUNyQixDQUFDO1lBRUYsTUFBTSxJQUFJLEdBQUcsZ0JBQU0sQ0FBQyxlQUFlLENBQ2pDLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUM1QyxDQUFDO1lBRUYsTUFBTSxJQUFJLEdBQUcsZ0JBQU07aUJBQ2hCLFVBQVUsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDO2lCQUMxQixNQUFNLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsTUFBTSxHQUFHLFNBQVMsQ0FBQztpQkFDekMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBRXBCLElBQUksSUFBSSxLQUFLLEdBQUcsQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFFO2dCQUNsQyxNQUFNLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxlQUFlLEVBQUUsR0FBRyxJQUFJLENBQUM7Z0JBRTdDLEdBQUcsQ0FBQyxJQUFJLEdBQUc7b0JBQ1QsTUFBTSxFQUFFLEdBQUc7b0JBQ1gsS0FBSztvQkFDTCxlQUFlO2lCQUNoQixDQUFDO2dCQUVGLE9BQU8sSUFBSSxFQUFFLENBQUM7YUFDZjtZQUVELE9BQU8sR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxNQUFNLEVBQUUsQ0FBQyx1QkFBdUIsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUNyRSxDQUFDO0tBQUE7SUFFSyxjQUFjLENBQ2xCLEdBQW9CLEVBQ3BCLEdBQXFCLEVBQ3JCLElBQTBCOztZQUUxQixJQUFJLEdBQUcsQ0FBQyxPQUFPLENBQUMsZUFBZSxDQUFDLEVBQUU7Z0JBQ2hDLElBQUk7b0JBQ0YsTUFBTSxhQUFhLEdBQUcsR0FBRyxDQUFDLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7b0JBRTlELElBQUksYUFBYSxDQUFDLENBQUMsQ0FBQyxLQUFLLFFBQVEsRUFBRTt3QkFDakMsT0FBTyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO3FCQUMvQjtvQkFFRCxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsR0FBRyxzQkFBRyxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLEVBQUUsU0FBUyxDQUFRLENBQUM7b0JBQ2hFLElBQUksRUFBRSxDQUFDO2lCQUNSO2dCQUFDLE9BQU8sR0FBRyxFQUFFO29CQUNaLE9BQU8sR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztpQkFDL0I7YUFDRjtpQkFBTTtnQkFDTCxPQUFPLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7YUFDL0I7UUFDSCxDQUFDO0tBQUE7Q0FDRjtBQUVELGtCQUFlLElBQUksYUFBYSxFQUFFLENBQUMifQ==