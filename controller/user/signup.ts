import { Request, Response } from "express";
import validator from "validator";
import bcrypt from "bcrypt";
import { user } from "../../models/user";

export default async (
  req: Request,
  res: Response
): Promise<void | Response> => {
  try {
    let { email, nickname, name, password, phone } = req.body;

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
    }

    // 솔트생성 및 해쉬화 진행
    bcrypt.genSalt(10, (err, salt) => {
      // 솔트생성 실패시 오류 메세지 전송
      if (err) {
        return res.status(400).json({ message: "솔트생성에 실패했습니다 !" });
      }
      console.log("salt입니다 = ", salt);
      // 솔트생성 성공시 해쉬화 진행
      bcrypt.hash(password, salt, async (err, hash) => {
        if (err)
          return res.status(400).json({
            message: "비밀번호 해쉬화에 실패했습니다.",
          });
        console.log("hash입니다 = ", hash);
        password = hash;
        // 비밀번호 해쉬화 성공시 회원가입 완료
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
      });
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
};
