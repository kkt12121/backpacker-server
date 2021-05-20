import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import "dotenv/config";

export default async (req: Request, res: Response, next: NextFunction) => {
  // console.log("req.headers.cookie입니다!!!!!!!!!!!!!!!!!!", req.headers);
  // console.log("토큰 입니다 !!!!!!!!!!!!!!!!", req.headers.authorization);
  if (req.headers.authorization) {
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, process.env.JWT_ACCESS_SECRET, (err, data: any) => {
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
              res.locals.id = data._id;
              // console.log("11111111111111111", res.locals.id);
              res.set("newAccessToken", newAccessToken);
              next();
            }
          }
        });
      } else {
        // console.log("data입니다~~~~~~~~~~~~~~~~~~~~", data);
        res.locals.id = data._id;
        // console.log("22222222222222", res.locals.id);
        next();
      }
    });
  } else {
    return res.status(401).json({ message: "토큰이 없습니다" });
  }
};
