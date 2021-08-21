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
  private MONGO_URI = `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_IP}:${process.env.MONGO_PORT}/?authSource=admin`;

  constructor() {
    this.connectWithRetry();
  }

  getMongoose() {
    return mongoose;
  }

  connectWithRetry = async () => {
    log("Attempting MongoDB connection");

    await mongoose
      .connect(this.MONGO_URI, this.mongooseOptions)
      .then(() => {
        log("MongoDB is connected");
      })
      .catch((err) => {
        const retrySeconds = 5;

        log(
          `MongoDB connection unsuccessful, will try reconnecting for the ${++this
            .count} time after ${retrySeconds} seconds. Error reason: ${err}`
        );

        setTimeout(this.connectWithRetry, retrySeconds * 1000);
      });
  };
}

export default new MongooseService();
