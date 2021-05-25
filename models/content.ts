import mongoose from "mongoose";

interface IContent {
  callinder: string;
  totalCost: number;
  thumbnail: string[];
  day: string[];
  title: string;
  touristRegion: string;
  touristSpot: string;
  items: any[];
  userinfo: string[];
}

interface contentModelInterface extends mongoose.Model<ContentDoc> {
  build(attr: IContent): ContentDoc;
}

interface ContentDoc extends mongoose.Document {
  callinder: string;
  totalCost: number;
  thumbnail: string[];
  day: string[];
  title: string;
  touristRegion: string;
  touristSpot: string;
  items: any[];
  userinfo: string[];
}

const contents = new mongoose.Schema({
  callinder: {
    type: String,
    required: true,
    trim: true,
  },
  totalCost: {
    type: Number,
    required: true,
  },
  thumbnail: [
    {
      type: String,
    },
  ],
  items: [
    { type: mongoose.Schema.Types.ObjectId, ref: "item", required: true },
  ],
  day: [
    {
      type: String,
      required: true,
      trip: true,
    },
  ],
  touristSpot: {
    type: String,
    required: true,
    trim: true,
  },
  touristRegion: {
    type: String,
    required: true,
    trim: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  userinfo: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      // required: true,
    },
  ],
});

contents.statics.build = (attr: IContent) => {
  return new content(attr);
};

const content = mongoose.model<ContentDoc, contentModelInterface>(
  "content",
  contents
);

export { content };
