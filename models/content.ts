import mongoose from "mongoose";

interface IContent {
  callinder: string;
  totalCost: number;
  day: string[];
  tag: string[];
  items: string[];
  userinfo: string;
}

interface contentModelInterface extends mongoose.Model<ContentDoc> {
  build(attr: IContent): ContentDoc;
}

interface ContentDoc extends mongoose.Document {
  callinder: string;
  totalCost: number;
  day: string[];
  tag: string[];
  items: string[];
  userinfo: string;
}

const contents = new mongoose.Schema({
  callinder: {
    type: String,
    required: true,
    trim: true,
  },
  totalCost: {
    type: Number,
    default: 0,
    required: true,
  },
  items: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "item",
      required: true,
    },
  ],
  day: [
    {
      type: String,
      required: true,
      trip: true,
    },
  ],
  tag: [
    {
      type: String,
      required: true,
      trim: true,
    },
  ],
  userinfo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    // required: true,
  },
});

contents.statics.build = (attr: IContent) => {
  return new content(attr);
};

const content = mongoose.model<ContentDoc, contentModelInterface>(
  "content",
  contents
);

export { content };
