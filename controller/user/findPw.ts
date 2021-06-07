import nodemailer from "nodemailer";
import { user } from "../../models/user";
import bcrypt from "bcrypt";
import "dotenv/config";
import { Request, Response, NextFunction } from "express";

export default async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  const { email } = req.body;
  // 일치하는 유저가 있는지 확인
  const findUser = await user.findOne({ email: email });
  // 일치하는 유저가 없다면 메세지를 통해 알린다
  if (!findUser) {
    return res.status(400).json({ message: "등록된 회원이 아닙니다 !" });
  }
  // 임시로 사용할 랜덤 비밀번호 생성
  let randomString = Math.random().toString(36).slice(2);
  // console.log(randomString);

  // 임시비밀번호도 솔트생성후 해쉬화 해서 db에 저장한다
  bcrypt.genSalt(10, (err, salt) => {
    // 솔트생성 실패시 오류 메세지 전송
    if (err) {
      return res.status(400).json({ message: "솔트생성에 실패했습니다 !" });
    }
    console.log("salt입니다 = ", salt);
    // 솔트생성 성공시 해쉬화 진행
    bcrypt.hash(randomString, salt, async (err, hash) => {
      if (err)
        return res.status(400).json({
          message: "비밀번호 해쉬화에 실패했습니다.",
        });
      console.log("hash입니다 = ", hash);
      randomString = hash;
      // 발급받은 비밀번호를 사용하기 위해 유저정보에 비밀번호를 발급받은 해쉬화한 임시비밀번호로 바꿔준다
      await user.updateOne(
        { email: email },
        { $set: { password: randomString } }
      );
    });
  });

  // 임시 비밀번호를 이메일로 전송 시킨다
  // 이메일 발송 구현
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "backpackerz27@gmail.com",
      pass: process.env.NODEMAILER_PASSWORD,
    },
  });

  var mailOptions = {
    from: "backpackerz27@gmail.com",
    to: email,
    subject: "임시 비밀번호 안내",
    html:
      "<h1 >backpacerz에서 새로운 비밀번호를 알려드립니다.</h1> <h2> 비밀번호 : " +
      randomString +
      "</h2>" +
      '<h3 style="color: crimson;">임시 비밀번호로 로그인 하신 후, 마이페이지 에서 반드시 비밀번호를 수정해 주세요.</h3>' +
      '<img src="https://cdn.discordapp.com/attachments/830042569349529635/851367188550909982/75388b72bbdacd05.png">',
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
      next(error);
    } else {
      console.log("Email sent: " + info.response);
      return res.status(200).json({ success: true });
    }
  });
};
