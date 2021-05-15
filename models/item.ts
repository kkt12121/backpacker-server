import mongoose from "mongoose";

interface IItem {
  place: string;
  cost: number;
  img: string;
  userinfo: string;
}

interface itemModelInterface extends mongoose.Model<ItemDoc> {
  build(attr: IItem): ItemDoc;
}

interface ItemDoc extends mongoose.Document {
  place: string;
  cost: number;
  img: string;
  userinfo: string;
}

const items = new mongoose.Schema({
  place: {
    type: String,
    required: true,
    trim: true,
  },
  cost: {
    type: Number,
    required: true,
    default: 0,
  },
  img: {
    type: String,
    required: true,
    trim: true,
  },
  userinfo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    // required: true,
  },
});

items.statics.build = (attr: IItem) => {
  return new item(attr);
};

const item = mongoose.model<ItemDoc, itemModelInterface>("item", items);

export { item };
