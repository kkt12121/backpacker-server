import { Request, Response } from "express";
import { user } from "../../models/user";
import jwt from "jsonwebtoken";
import "dotenv/config";

export default async (
  req: Request,
  res: Response
): Promise<void | Response> => {
  try {
    const { email, password } = req.body;

    const userInfo = await user.findOne({ email: email });

    if (!userInfo) {
      return res.status(400).json({ message: "등록된 회원이 아닙니다 !" });
    }

    if (userInfo.password !== password) {
      return res.status(400).json({ message: "잘못된 비밀번호 입니다 !" });
    }
    // console.log(userInfo);

    // jwt
    const accessToken = jwt.sign(
      { _id: userInfo._id },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: "5h" }
    );
    // console.log("accessToken입니다!!!!!!!!!!!", accessToken);
    const refreshToken = jwt.sign(
      { _id: userInfo._id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "1d" }
    );
    // console.log("refreshToken입니다!!!!!!!!!!!", refreshToken);
    await user.updateOne(
      { _id: userInfo._id },
      { $set: { refreshToken: refreshToken } },
      { upsert: true },
      (err) => {
        if (err) {
          console.log(err);
        } else {
          return res
            .cookie("accessToken", accessToken)
            .set("refresh-Token", refreshToken)
            .set("Access-Control-Expose-Headers", "refresh-Token")
            .status(200)
            .json({
              accessToken: accessToken,
              message: "로그인 성공 !",
            });
        }
      }
    );
  } catch (err) {
    return res.status(500).json(err);
  }
};
