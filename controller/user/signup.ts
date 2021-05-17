import { Request, Response } from "express";
import validator from "validator";
import { user } from "../../models/user";

export default async (
  req: Request,
  res: Response
): Promise<void | Response> => {
  try {
    const { email, nickname, name, password, phone } = req.body;

    // 이미 존재하는 이메일인지 확인
    const userEmail = await user.findOne({ email: email });
    // 이미 존재하는 닉네임인지 확인
    const userNickName = await user.findOne({ nickname: nickname });

    // 이메일과 닉네임 이라면 만들수없음
    if (userEmail) {
      return res.status(409).json({ message: "이미 등록된 이메일 입니다 !" });
    }

    if (userNickName) {
      return res.status(409).json({ message: "이미 사용중인 닉네임 입니다 !" });
    }

    // 이메일 형식이 유효한지 확인후 유효하지 않으면 알려준다
    if (!validator.isEmail(email)) {
      return res
        .status(400)
        .json({ message: "올바른 이메일 형식이 아닙니다 !" });
    } else {
      // 이메일 형식이 유효하다면 회원가입을 할수있다
      const newUser = user.build({
        name: name,
        email: email,
        password: password,
        nickname: nickname,
        phone: phone,
      });
      await newUser.save();
      return res.status(201).json({
        email: newUser.email,
        password: newUser.password,
        name: newUser.name,
        nickname: newUser.nickname,
        phone: newUser.phone,
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
};
