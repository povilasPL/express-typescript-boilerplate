"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const debug_1 = __importDefault(require("debug"));
const log = debug_1.default("app:mongoose-service");
class MongooseService {
    constructor() {
        this.count = 0;
        this.mongooseOptions = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000,
            useFindAndModify: false,
        };
        this.connectWithRetry = () => {
            log("Attempting MongoDB connection");
            mongoose_1.default
                .connect("mongodb://localhost:27017/api-db", this.mongooseOptions)
                .then(() => {
                log("MongoDB is connected");
            })
                .catch((err) => {
                const retrySeconds = 5;
                log(`MongoDB connection unsuccessful, will try re-connecting #${++this
                    .count} after ${retrySeconds} seconds. Error reason: ${err}`);
                setTimeout(this.connectWithRetry, retrySeconds * 1000);
            });
        };
        this.connectWithRetry();
    }
    getMongoose() {
        return mongoose_1.default;
    }
}
exports.default = new MongooseService();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9uZ29vc2Uuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NvbW1vbi9zZXJ2aWNlcy9tb25nb29zZS5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsd0RBQWdDO0FBQ2hDLGtEQUEwQjtBQUUxQixNQUFNLEdBQUcsR0FBb0IsZUFBSyxDQUFDLHNCQUFzQixDQUFDLENBQUM7QUFFM0QsTUFBTSxlQUFlO0lBU25CO1FBUlEsVUFBSyxHQUFHLENBQUMsQ0FBQztRQUNWLG9CQUFlLEdBQUc7WUFDeEIsZUFBZSxFQUFFLElBQUk7WUFDckIsa0JBQWtCLEVBQUUsSUFBSTtZQUN4Qix3QkFBd0IsRUFBRSxJQUFJO1lBQzlCLGdCQUFnQixFQUFFLEtBQUs7U0FDeEIsQ0FBQztRQVVGLHFCQUFnQixHQUFHLEdBQUcsRUFBRTtZQUN0QixHQUFHLENBQUMsK0JBQStCLENBQUMsQ0FBQztZQUVyQyxrQkFBUTtpQkFDTCxPQUFPLENBQUMsa0NBQWtDLEVBQUUsSUFBSSxDQUFDLGVBQWUsQ0FBQztpQkFDakUsSUFBSSxDQUFDLEdBQUcsRUFBRTtnQkFDVCxHQUFHLENBQUMsc0JBQXNCLENBQUMsQ0FBQztZQUM5QixDQUFDLENBQUM7aUJBQ0QsS0FBSyxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUU7Z0JBQ2IsTUFBTSxZQUFZLEdBQUcsQ0FBQyxDQUFDO2dCQUV2QixHQUFHLENBQ0QsNERBQTRELEVBQUUsSUFBSTtxQkFDL0QsS0FBSyxVQUFVLFlBQVksMkJBQTJCLEdBQUcsRUFBRSxDQUMvRCxDQUFDO2dCQUVGLFVBQVUsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsWUFBWSxHQUFHLElBQUksQ0FBQyxDQUFDO1lBQ3pELENBQUMsQ0FBQyxDQUFDO1FBQ1AsQ0FBQyxDQUFDO1FBekJBLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO0lBQzFCLENBQUM7SUFFRCxXQUFXO1FBQ1QsT0FBTyxrQkFBUSxDQUFDO0lBQ2xCLENBQUM7Q0FxQkY7QUFFRCxrQkFBZSxJQUFJLGVBQWUsRUFBRSxDQUFDIn0=