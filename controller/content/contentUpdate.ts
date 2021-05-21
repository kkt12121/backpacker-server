import { content } from "../../models/content";
import { Request, Response, NextFunction } from "express";

export default async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  try {
    const {
      callinder,
      totalCost,
      day,
      thumbnail,
      touristSpot,
      title,
      touristRegion,
    } = req.body;
    const contentId = req.params.id;
    const userId = res.locals.id;
    if (userId) {
      if (callinder) {
        await content.updateOne(
          { _id: contentId },
          {
            $set: {
              callinder: callinder,
            },
          }
        );
      }
      if (totalCost) {
        await content.updateOne(
          { _id: contentId },
          {
            $set: {
              totalCost: totalCost,
            },
          }
        );
      }
      if (day) {
        await content.updateOne(
          { _id: contentId },
          {
            $set: {
              day: day,
            },
          }
        );
      }
      if (thumbnail) {
        await content.updateOne(
          { _id: contentId },
          {
            $set: {
              thumbnail: thumbnail,
            },
          }
        );
      }
      if (touristSpot) {
        await content.updateOne(
          { _id: contentId },
          {
            $set: {
              touristSpot: touristSpot,
            },
          }
        );
      }
      if (title) {
        await content.updateOne(
          { _id: contentId },
          {
            $set: {
              title: title,
            },
          }
        );
      }
      if (touristRegion) {
        await content.updateOne(
          { _id: contentId },
          {
            $set: {
              touristRegion: touristRegion,
            },
          }
        );
      }
      res.status(200).json({ message: "게시물을 수정하였습니다 !" });
    } else {
      return res.status(401).json({ message: "로그인 상태가 아닙니다 !" });
    }
  } catch (err) {
    return res.status(500).json(err);
  }
};
