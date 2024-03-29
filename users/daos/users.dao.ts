import shortid from "shortid";
import debug from "debug";

import MongooseService from "../../common/services/mongoose.service";
import { PermissionLevel } from "../../common/middleware/common.permissionlevel.enum";
import { CreateUserDto } from "../dto/create.user.dto";
import { PutUserDto } from "../dto/put.user.dto";
import { PatchUserDto } from "../dto/patch.user.dto";

const log: debug.IDebugger = debug("app:in-memory-dao");

class UsersDao {
  Schema = MongooseService.getMongoose().Schema;

  userSchema = new this.Schema(
    {
      _id: String,
      email: String,
      password: { type: String, select: false },
      firstName: String,
      lastName: String,
      permissionLevel: Number,
    },
    { id: false }
  );

  User = MongooseService.getMongoose().model("Users", this.userSchema);

  constructor() {
    log("Created new instance of UsersDao");
  }

  async addUser(userFields: CreateUserDto) {
    const userId = shortid.generate();

    const user = new this.User({
      _id: userId,
      ...userFields,
      permissionLevel: PermissionLevel.FREE_PERMISSION,
    });

    await user.save();
    return userId;
  }

  async getUsers(limit = 25, page = 0) {
    return this.User.find()
      .limit(limit)
      .skip(limit * page)
      .exec();
  }

  async getUserById(userId: string) {
    return this.User.findOne({ _id: userId }).populate("User").exec();
  }

  async getUserByEmail(email: string) {
    return this.User.findOne({ email }).exec();
  }

  async getUserByEmailWithPassword(email: string) {
    return this.User.findOne({ email })
      .select("_id email permissionLevel +password")
      .exec();
  }

  async updateUserById(userId: string, userFields: PatchUserDto | PutUserDto) {
    const existingUser = await this.User.findOneAndUpdate(
      { _id: userId },
      { $set: userFields },
      { new: true }
    ).exec();

    return existingUser;
  }

  async removeUserById(userId: string) {
    return this.User.deleteOne({ _id: userId }).exec();
  }
}

export default new UsersDao();
