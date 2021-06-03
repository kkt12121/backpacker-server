import { user } from "../../models/user";
import { content } from "../../models/content";
import { item } from "../../models/item";
import { Request, Response, NextFunction } from "express";

export default async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  try {
    const userId = res.locals.id;
    if (!userId) {
      return res.status(401).json({ message: "로그인 상태가 아닙니다 !" });
    } else {
      // 유저 정보 삭제하기
      await user.deleteOne({ _id: userId });
      return res
        .cookie("hashPw", "", {
          httpOnly: true,
          maxAge: 0,
          domain: "backpackerz.shop",
        })
        .status(200)
        .json({ message: "정상적으로 회원탈퇴가 처리되었습니다 !" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
};
