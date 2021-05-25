import { user } from "../../models/user";
import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";

export default async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  try {
    console.log(res.locals.id);
    const userId = res.locals.id;
    let { password, name, nickname, phone } = req.body;
    if (!userId) {
      return res.status(401).json({ message: "로그인 상태가 아닙니다 !" });
    } else {
      // password 수정
      if (password) {
        // 수정한 passwrod도 해쉬화 한후 db에 저장한다
        bcrypt.genSalt(10, (err, salt) => {
          // 솔트생성 실패시 오류 메세지 전송
          if (err) {
            return res
              .status(400)
              .json({ message: "솔트생성에 실패했습니다 !" });
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
            await user.updateOne(
              { _id: userId },
              {
                $set: {
                  password: password,
                },
              }
            );
          });
        });
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
        const findNickName = await user.find({ nickname: nickname });
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
