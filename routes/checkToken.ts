import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { user } from "../models/user";
import "dotenv/config";

export default async (req: Request, res: Response, next: NextFunction) => {
  const checkUser = req.cookies.hashPw;
  const accessSecret = process.env.JWT_ACCESS_SECRET;
  const refreshSecret = process.env.JWT_REFRESH_SECRET;
  if (req.headers.authorization) {
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, accessSecret, async (err, data: any) => {
      if (err) {
        // accessToken이 만료 되었으면 사용자 db에 저장되어있는 refreshToken의 유효성 검사를 하고
        // 유효 하다면 새로운 accessToken을 만들어서 발급한다
        const findRefreshToken: any = await user.findOne({
          password: checkUser,
        });
        // console.log(findRefreshToken);
        if (findRefreshToken) {
          // 사용자 db에 있는 refreshToken이 유효한지 검사한다
          jwt.verify(
            findRefreshToken.refreshToken,
            refreshSecret,
            (err: any, data: any) => {
              // err가 나면 기간이 만료 되었기에 재 로그인 요청한다
              if (err) {
                res.status(401).json({
                  message:
                    "refreshToken이 만료 하였습니다 재 로그인 해주세요 !",
                });
              } else {
                // 유효 하다면 새로운 accessToken을 발급한다
                const newAccessToken = jwt.sign(
                  { _id: data._id },
                  accessSecret,
                  {
                    expiresIn: "5h",
                  }
                );
                res.locals.id = data._id;
                res.set("newAccessToken", newAccessToken);
                next();
              }
            }
          );
        }
      } else {
        res.locals.id = data._id;
        next();
      }
    });
  } else {
    return res.status(401).json({ message: "토큰이 없습니다" });
  }
};
