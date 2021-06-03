import { Request, Response, NextFunction } from "express";
import axios from "axios";
import { user } from "../../models/user";
import jwt from "jsonwebtoken";
import "dotenv/config";

export default async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  try {
    const { authorizationCode } = req.body;
    // console.log(authorizationCode);
    if (authorizationCode) {
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
          code: authorizationCode,
          grant_type: "authorization_code",
          redirect_uri: "https://backpackerz.shop",
        },
      })
        .then(async (data) => {
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
              { expiresIn: "30d" }
            );
            const refreshToken = jwt.sign(
              { _id: alreadyUser._id },
              process.env.JWT_REFRESH_SECRET,
              { expiresIn: "60d" }
            );
            console.log(
              "이미 존재하는 유저의 accessToken입니다 !",
              accessToken
            );
            await user.updateOne(
              { _id: alreadyUser._id },
              { $set: { refreshToken: refreshToken } },
              { upsert: true },
              (err) => {
                if (err) {
                  console.log(err);
                } else {
                  return res
                    .cookie("hashPw", alreadyUser.password, {
                      httpOnly: true,
                      maxAge: 60 * 60 * 24 * 1000,
                      domain: "backpackerz.shop",
                    })
                    .status(200)
                    .json({
                      accessToken: accessToken,
                      message: "로그인 성공 !",
                    });
                }
              }
            );
          } else {
            // 랜덤 닉네임 생성
            // 1. 고정 닉네임 backpacker 선언
            let randomNickName = "backpacker";
            // 2. 고정 닉네임 뒤에 붙일 랜덤숫자 2자리를 생성하여 붙인다
            for (let i = 0; i < 2; i++) {
              randomNickName += Math.floor(Math.random() * 10);
            }
            // 3. 혹시나 생성한 랜덤닉네임이 이미 존재하는 닉네임이라면 끝에
            // 랜덤으로 숫자한개를 생성하여 붙인다
            const findNickName: any = await user.find({
              nickname: randomNickName,
            });
            if (findNickName.length !== 0) {
              return (randomNickName += Math.floor(Math.random() * 10));
            }

            // 신규 유저라면 유저정보를 db에 저장하고 새로운 accessToken을 발급후
            // refreshToken을 발급하여 db에 저장시킨다
            const newUser = await user.build({
              name: data.data.name,
              email: data.data.email,
              password: data.data.id,
              nickname: randomNickName,
              phone: "010-0000-0000",
            });
            await newUser.save();
            const findUser: any = await user.findOne({
              email: data.data.email,
            });
            const accessToken = jwt.sign(
              { _id: findUser._id },
              process.env.JWT_ACCESS_SECRET,
              { expiresIn: "30d" }
            );
            const refreshToken = jwt.sign(
              { _id: findUser._id },
              process.env.JWT_REFRESH_SECRET,
              { expiresIn: "60d" }
            );
            console.log("신규유저 accessToken!!!!!!!!!!!!!", accessToken);
            await user.updateOne(
              { _id: findUser._id },
              { $set: { refreshToken: refreshToken } },
              { upsert: true },
              (err) => {
                if (err) {
                  console.log(err);
                } else {
                  return res
                    .cookie("hashPw", findUser.password, {
                      httpOnly: true,
                      maxAge: 60 * 60 * 24 * 1000,
                      domain: "backpackerz.shop",
                    })
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
          console.log(err);
          return err;
        });
    } else {
      return res
        .status(400)
        .json({ message: "authorizationCode가 없습니다 !" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
};
