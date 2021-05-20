import mongoose from "mongoose";
import { content } from "./models/content";
import { item } from "./models/item";
import { user } from "./models/user";

mongoose.connect("mongodb://localhost:27017/backpacker", {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
//* 연결 실패
db.on("error", function () {
  console.log("Connection Failed!");
});
//* 연결 성공
db.once("open", function () {
  console.log("Connected!");
});

// user 샘플정보
// const newUser = user.build({
//   name: "김코딩",
//   email: "test@test",
//   password: "0000",
//   nickname: "코린이",
//   phone: "010-1234-5678",
// });

// newUser.save(function (error) {
//   if (error) {
//     console.log(error);
//   } else {
//     console.log("Saved schedule!");
//   }
// });

// item 샘플정보
const newItem = item.build({
  place: "명동",
  cost: 45000,
  averageCost: 90000,
  img: "명동.jpg",
  userinfo: "609eb1b2ce51cce5edb53017",
});

newItem.save(function (error) {
  if (error) {
    console.log(error);
  } else {
    console.log("Saved schedule!");
  }
});

// content 샘플정보
// const newContent = content.build({
//   callinder: "2021년 5월 15일",
//   totalCost: 150000,
//   day: ["1일", "2일"],
//   tag: ["서울", "이태원"],
//   items: ["609eb28e67e008e6a20acf23"],
//   userinfo: "609eb1b2ce51cce5edb53017",
// });

// newContent.save(function (error) {
//   if (error) {
//     console.log(error);
//   } else {
//     console.log("Saved schedule!");
//   }
// });
