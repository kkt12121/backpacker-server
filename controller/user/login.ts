import { Request, Response } from "express";
import { user } from "../../models/user";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
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
    } else {
      // 패스워드가 일치하는지 확인한다
      const checkPw = () => {
        bcrypt.compare(password, userInfo.password, async (error, isMatch) => {
          if (error) {
            return res.status(400).json({ message: "검증에 실패하였습니다 !" });
          }
          // 비밀번호가 일치하다면 토큰생성후 로그인
          if (isMatch) {
            // jwt
            const accessToken = jwt.sign(
              { _id: userInfo._id },
              process.env.JWT_ACCESS_SECRET,
              { expiresIn: "5h" }
            );
            const refreshToken = jwt.sign(
              { _id: userInfo._id },
              process.env.JWT_REFRESH_SECRET,
              { expiresIn: "1d" }
            );
            await user.updateOne(
              { _id: userInfo._id },
              { $set: { refreshToken: refreshToken } },
              { upsert: true },
              (err) => {
                if (err) {
                  console.log(err);
                } else {
                  return res
                    .cookie("hashPw", userInfo.password)
                    .status(200)
                    .json({
                      accessToken: accessToken,
                      message: "로그인 성공 !",
                    });
                }
              }
            );
          } else {
            return res.status(400).json({
              message: "비밀번호가 틀렸습니다.",
            });
          }
        });
      };
      checkPw();
    }
  } catch (err) {
    return res.status(500).json(err);
  }
};
