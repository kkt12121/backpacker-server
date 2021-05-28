import { content } from "../../models/content";
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
      const findContent = await content
        .find({ userinfo: userId })
        .select({ __v: 0 });
      return res.status(200).json({ findContent });
    }
  } catch (err) {
    return res.status(500).json(err);
  }
};
