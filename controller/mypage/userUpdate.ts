import { user } from "../../models/user";
import { Request, Response, NextFunction } from "express";

export default async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  try {
    console.log(res.locals.id);
    const userId = res.locals.id;
    const { password, name, nickname, phone } = req.body;
    if (!userId) {
      return res.status(401).json({ message: "로그인 상태가 아닙니다 !" });
    } else {
      // password 수정
      if (password) {
        await user.updateOne(
          { _id: userId },
          {
            $set: {
              password: password,
            },
          }
        );
      }
      // name 수정
      if (name) {
        await user.updateOne(
          { _id: userId },
          {
            $set: {
              name: name,
            },
          }
        );
      }
      // nickname 수정
      if (nickname) {
        const findNickName = await user.find({
          $and: [{ _id: { $ne: userId } }, { nickname: nickname }],
        });
        // 이미 사용중인 nickname이면 경고
        if (findNickName.length !== 0) {
          return res
            .status(409)
            .json({ message: "이미 사용중인 닉네임 입니다 !" });
        } else {
          await user.updateOne(
            { _id: userId },
            {
              $set: {
                nickname: nickname,
              },
            }
          );
        }
      }
      // phone 수정
      if (phone) {
        await user.updateOne(
          { _id: userId },
          {
            $set: {
              phone: phone,
            },
          }
        );
      }

      res.status(200).json({ message: "유저 정보를 수정하였습니다 !" });
    }
  } catch (err) {
    return res.status(500).json(err);
  }
};
