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
    console.log(res.locals.id);
    const userId = res.locals.id;
    if (!userId) {
      return res.status(401).json({ message: "로그인 상태가 아닙니다 !" });
    } else {
      // 유저가 작성한 item을 지운다
      await item.deleteMany({ userinfo: userId });
      // 유저가 작성한 모든 content를 지운다
      await content.deleteMany({ userinfo: userId });
      // 유저 정보 삭제하기
      await user.deleteOne({ _id: userId });
      res
        .clearCookie("hashPw")
        .status(200)
        .json({ message: "정상적으로 회원탈퇴가 처리되었습니다 !" });
    }
  } catch (err) {
    return res.status(500).json(err);
  }
};
