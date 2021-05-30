import { content } from "../../models/content";
import { Request, Response, NextFunction } from "express";

export default async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  try {
    console.log(req.params.id);
    const contentId = req.params.id;
    const userId = res.locals.id;
    const checkContent: any = await content.findOne({ _id: contentId });
    if (checkContent.length !== 0) {
      await content.updateOne(
        { _id: contentId },
        { $push: { userinfo: userId } }
      );
      res.status(200).json({ message: "친구초대 완료 !" });
    } else {
      res.status(400).json({ message: "없는 게시물입니다 !" });
    }
  } catch (err) {
    console.log(err)
    return res.status(500).json(err);
  }
};
