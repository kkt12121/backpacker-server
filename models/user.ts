import mongoose from "mongoose";

interface IUser {
  name: string;
  email: string;
  password: string;
  nickname: string;
  phone: string;
  refreshToken?: string | null;
}

interface userModelInterface extends mongoose.Model<UserDoc> {
  build(attr: IUser): UserDoc;
}

interface UserDoc extends mongoose.Document {
  name: string;
  email: string;
  password: string;
  nickname: string;
  phone: string;
  refreshToken?: string | null;
}

const users = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    trim: true,
  },
  password: {
    type: String,
    trim: true,
  },
  nickname: {
    type: String,
    trim: true,
  },
  phone: {
    type: String,
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
