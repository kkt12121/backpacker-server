import express from "express";
import mongoose from "mongoose";
import https from "https";
import fs from "fs";
import cookieParser from "cookie-parser";
import { json } from "body-parser";
import cors from "cors";
import routes from "./routes";
import "dotenv/config";

const atlas = process.env.ATLAS_URI;
const port = 4000;
const app = express();

// mongoose.connect(
//   "mongodb://localhost:27017/backpacker",
//   {
//     useCreateIndex: true,
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   },
//   () => {
//     console.log("connected to database");
//   }
// );

// 배포용 아틀라스 연결
mongoose.connect(
  atlas,
  {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  () => {
    console.log("atlas연결 성공 !");
  }
);

app.use(cookieParser());
app.use(json());
app.use(
  cors({
    origin: true,
    methods: "GET, POST, OPTIONS, DELETE, PUT",
    credentials: true,
    // allowedHeaders: ["Content-Type", "*"],
  })
);
// 라우터
app.use("/user", routes.user);
app.use("/content", routes.content);
app.use("/mypage", routes.mypage);

setInterval(() => {
  https.get("https://server.backpacker.monster");
}, 600000);

app.get("/", function (req, res) {
  res.send("<h1>hi friend!</h1>");
});

let server;

if (fs.existsSync("./key.pem") && fs.existsSync("./cert.pem")) {
  server = https
    .createServer(
      {
        key: fs.readFileSync(__dirname + `/` + "key.pem", "utf-8"),
        cert: fs.readFileSync(__dirname + `/` + "cert.pem", "utf-8"),
      },
      app
    )
    .listen(port, function () {
      console.log("https 서버연결 성공 !");
    });
} else {
  server = app.listen(port, function () {
    console.log("http로 연결되었습니다 !");
  });
}
