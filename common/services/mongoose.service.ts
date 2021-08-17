import mongoose from "mongoose";
import debug from "debug";

const log: debug.IDebugger = debug("app:mongoose-service");

class MongooseService {
  private count = 0;
  private mongooseOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
    useFindAndModify: false,
  };

  constructor() {
    this.connectWithRetry();
  }

  getMongoose() {
    return mongoose;
  }

  connectWithRetry = () => {
    log("Attempting MongoDB connection");

    mongoose
      .connect("mongodb://localhost:27017/api-db", this.mongooseOptions)
      .then(() => {
        log("MongoDB is connected");
      })
      .catch((err) => {
        const retrySeconds = 5;

        log(
          `MongoDB connection unsuccessful, will try re-connecting #${++this
            .count} after ${retrySeconds} seconds. Error reason: ${err}`
        );

        setTimeout(this.connectWithRetry, retrySeconds * 1000);
      });
  };
}

export default new MongooseService();
