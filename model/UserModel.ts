import { Schema } from "mongoose";
import { IUser } from "../interfaces/IUser";
import { CommonModel } from "./CommonModel";

class UserModel extends CommonModel<IUser> {
  createSchema(): Schema {
    return new Schema(
      {
        email: String,
        ssoID: {
          type: String,
          required: true,
          unique: true,
        },
      },
      { collection: "users" }
    );
  }

  get modelName(): string {
    return "UserModel";
  }

  get collectionName(): string {
    return "users";
  }
}

export { UserModel };
