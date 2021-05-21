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
    if (!userId) {
      return res.status(401).json({ message: "로그인 상태가 아닙니다 !" });
    } else {
      const userFind: any = await user
        .findOne({ _id: userId })
        .select({ _id: 0, __v: 0, refreshToken: 0 });
      return res.status(200).json({ userFind });
    }
  } catch (err) {
    return res.status(500).json(err);
  }
};
