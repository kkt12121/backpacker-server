import express from "express";
import mongoose from "mongoose";
import https from "https";
import fs from "fs";
import { json } from "body-parser";
import cors from "cors";
import axios from "axios";
import routes from "./routes";

const port = 4000;
const app = express();

mongoose.connect(
  "mongodb://localhost:27017/backpacker",
  {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  () => {
    console.log("connected to database");
  }
);

app.use(json());
app.use(
  cors({
    origin: true,
    methods: "GET, POST, OPTIONS, DELETE, PUT",
    credentials: true,
    allowedHeaders: ["Content-Type", "*"],
  })
);
// 라우터
app.use("/user", routes.user);

const url =
  "http://apis.data.go.kr/B553077/api/open/sdsc/storeOne?key=19911025&ServiceKey=2jWxf3CaG6XsNPtd02pim26GqE1uW7iuF81ySXD%2FjoUXGDSovXRWcKwD%2BI%2BEk3piykabTG8zGajcwQJJPrbf2A%3D%3D&type=json";

app.get("/api", (req, res) => {
  axios.get(url).then((data) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.json(data.data.body);
  });
});

// app.get("/", function (req, res) {
//   res.send("<h1>hi friend!</h1>");
// });

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
