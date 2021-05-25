import { Request, Response, NextFunction } from "express";
import axios from "axios";
import { user } from "../../models/user";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export default async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  console.log(
    "authorizationCode입니다 ==============",
    req.body.authorizationCode
  );
  if (req.body.authorizationCode) {
    const clientID = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const url = "https://accounts.google.com/o/oauth2/token";
    await axios({
      method: "POST",
      url: url,
      headers: {
        "Content-Type": "application/json",
      },
      params: {
        client_id: clientID,
        client_secret: clientSecret,
        code: req.body.authorizationCode,
        grant_type: "authorization_code",
        redirect_uri: "http://localhost:3000",
      },
    })
      .then(async (data) => {
        // console.log("data.data입니다 ============", data.data.access_token);
        const accessToken = data.data.access_token;
        let response = await axios({
          method: "GET",
          url: "https://www.googleapis.com/oauth2/v1/userinfo?alt=json",
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        return response;
      })
      .then(async (data) => {
        const alreadyUser = await user.findOne({ email: data.data.email });
        // 이미 있는 유저라면 새로운 accessToken을 발급하고 refreshToken을 db에 저장한다
        if (alreadyUser) {
          const accessToken = jwt.sign(
            { _id: alreadyUser._id },
            process.env.JWT_ACCESS_SECRET,
            { expiresIn: "5h" }
          );
          const refreshToken = jwt.sign(
            { _id: alreadyUser._id },
            process.env.JWT_REFRESH_SECRET,
            { expiresIn: "1d" }
          );
          console.log("이미 존재하는 유저의 accessToken입니다 !", accessToken);
          await user.updateOne(
            { _id: alreadyUser._id },
            { $set: { refreshToken: refreshToken } },
            { upsert: true },
            (err) => {
              if (err) {
                console.log(err);
              } else {
                return res
                  .cookie("hashPw", alreadyUser.password)
                  .status(200)
                  .json({
                    accessToken: accessToken,
                    message: "로그인 성공 !",
                  });
              }
            }
          );
        } else {
          // console.log("신규 유저 입니다 !!!!!!!!", data.data);
          // 신규 유저라면 유저정보를 db에 저장하고 새로운 accessToken을 발급후
          // refreshToken을 발급하여 db에 저장시킨다
          const newUser = await user.build({
            name: data.data.name,
            email: data.data.email,
            password: data.data.id,
            nickname: data.data.name,
            phone: "010-0000-0000",
          });
          await newUser.save();
          const findUser: any = await user.findOne({ email: data.data.email });
          // console.log("findUser입니다 !!!!!!!!!!", findUser);
          const accessToken = jwt.sign(
            { _id: findUser._id },
            process.env.JWT_ACCESS_SECRET,
            { expiresIn: "5h" }
          );
          const refreshToken = jwt.sign(
            { _id: findUser._id },
            process.env.JWT_REFRESH_SECRET,
            { expiresIn: "1d" }
          );
          console.log("신규유저 accessToken!!!!!!!!!!!!!", accessToken);
          // console.log("refreshToken!!!!!!!!!!!!!", refreshToken);
          await user.updateOne(
            { _id: findUser._id },
            { $set: { refreshToken: refreshToken } },
            { upsert: true },
            (err) => {
              if (err) {
                console.log(err);
              } else {
                return res
                  .cookie("hashPw", findUser.password)
                  .status(200)
                  .json({
                    accessToken: accessToken,
                    message: "로그인 성공 !",
                  });
              }
            }
          );
        }
      })
      .catch((err) => {
        return err;
      });
  }
};
