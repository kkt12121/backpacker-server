import { user } from "../../models/user";
import { Request, Response, NextFunction } from "express";

export default async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  const { name, phone } = req.body;
  // 입력한 이름과 전화번호가 일치하는 유저를 찾는다
  const findUser = await user.findOne({ name: name, phone: phone });
  // 일치하는 유저가 없으면 메세지를 통해 알린다
  if (!findUser) {
    return res.status(400).json({ message: "등록된 회원이 아닙니다 !" });
  } else {
    // 일치하는 유저가 있다면 이메일 정보만 알려준다
    return res
      .status(200)
      .json({ email: findUser.email, message: "회원님의 이메일 입니다 !" });
  }
};
