import mongoose from "mongoose";

interface IUser {
  name: string;
  email: string;
  password: string;
  nickname: string;
  refreshToken?: string;
}

interface userModelInterface extends mongoose.Model<UserDoc> {
  build(attr: IUser): UserDoc;
}

interface UserDoc extends mongoose.Document {
  name: string;
  email: string;
  password: string;
  nickname: string;
  refreshToken?: string;
}

const users = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
  nickname: {
    type: String,
    required: true,
    trim: true,
  },
  refreshToken: {
    type: String,
  },
});

users.statics.build = (attr: IUser) => {
  return new user(attr);
};

const user = mongoose.model<UserDoc, userModelInterface>("user", users);

export { user };
