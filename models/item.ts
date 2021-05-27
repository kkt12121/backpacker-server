import mongoose from "mongoose";

interface IItem {
  place: string;
  price: number;
  averagePrice: number;
  category: string;
  img: string;
  mapx: string;
  mapy: string;
  detail: string;
  tel: string;
  address: string;
  contentId: string;
  userinfo: string[];
}

interface itemModelInterface extends mongoose.Model<ItemDoc> {
  build(attr: IItem): ItemDoc;
}

interface ItemDoc extends mongoose.Document {
  place: string;
  price: number;
  averagePrice: number;
  category: string;
  mapx: string;
  mapy: string;
  img: string;
  tel: string;
  address: string;
  detail: string;
  contentId: string;
  userinfo: string[];
}

const items = new mongoose.Schema({
  place: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
    default: 0,
  },
  averagePrice: {
    type: Number,
    required: true,
    default: 0,
  },
  img: {
    type: String,
    required: true,
    trim: true,
  },
  mapx: {
    type: String,
    required: true,
    trim: true,
  },
  mapy: {
    type: String,
    required: true,
    trim: true,
  },
  contentId: {
    type: String,
    required: true,
    trim: true,
  },
  detail: {
    type: String,
    required: true,
    trim: true,
  },
  address: {
    type: String,
    required: true,
    trim: true,
  },
  tel: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: String,
    required: true,
    trim: true,
  },
  userinfo: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  ],
});

items.statics.build = (attr: IItem) => {
  return new item(attr);
};

const item = mongoose.model<ItemDoc, itemModelInterface>("item", items);

export { item };
