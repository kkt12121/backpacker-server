import { content } from "../../models/content";
import { Request, Response, NextFunction } from "express";

export default async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  try {
    const { touristSpot } = req.body;

    if (touristSpot) {
      const selectContent = await content.find({
        touristSpot: touristSpot,
      });
      if (selectContent.length === 0) {
        return res.status(400).json({ message: "해당하는 정보가 없습니다 !" });
      } else {
        return res.status(200).json({ selectContent });
      }
    } else {
      const contentList = await content.find();
      return res.status(200).json({ contentList });
    }
  } catch (err) {
    return res.status(500).json(err);
  }
};
