import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import "dotenv/config";

export default async (req: Request, res: Response, next: NextFunction) => {
  // console.log("req.headers.cookie입니다!!!!!!!!!!!!!!!!!!", req.headers);
  // console.log(req);
  if (req.headers.authorization) {
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, process.env.JWT_ACCESS_SECRET, (err, data) => {
      if (err) {
        jwt.verify(token, process.env.JWT_REFRESH_SECRET, (err, data: any) => {
          if (err) {
            return res.status(401).json({ message: "토큰이 만료되었습니다 !" });
          } else {
            let curTime = Date.now() / 1000;
            if (curTime > data.exp) {
              return res.status(401).json({
                message: "토큰이 만료되었습니다. 재로그인 해주세요 !",
              });
            } else {
              const newAccessToken = jwt.sign(
                { _id: data._id },
                process.env.JWT_ACESS_SECRET,
                { expiresIn: "5h" }
              );
              res.set("newAccessToken", newAccessToken);
              next();
            }
          }
        });
      } else {
        console.log(data);
        //? accessToken이 증명되었을 경우
        next();
      }
    });
  } else {
    return res.status(401).json({ message: "토큰이 없습니다" });
  }
};
