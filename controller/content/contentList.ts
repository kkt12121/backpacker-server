import { content } from "../../models/content";
import { Request, Response, NextFunction } from "express";

export default async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  try {
    const { touristSpot, touristRegion } = req.body;
    // touristSpot이 있으면
    if (touristSpot) {
      // db에 해당하는 touristSpot이 있는지 찾는다
      const selectTouristSpot = await content.find({
        touristSpot: touristSpot,
      });

      // 없다면 경고 메세지를 보내고 있으면 정보를 보낸다
      if (selectTouristSpot.length === 0) {
        return res.status(400).json({ message: "해당하는 정보가 없습니다 !" });
      } else {
        return res.status(200).json({ selectTouristSpot });
      }
    } else if (touristRegion) {
      // touristRegion이 있으면
      // db에 해당하는 touristRegion이 있는지 찾는다
      // 없다면 경고 메세지를 보내고 있으면 정보를 보낸다
      const selectTouristRegion = await content.find({
        touristRegion: touristRegion,
      });
      if (selectTouristRegion.length === 0) {
        return res.status(400).json({ message: "해당하는 정보가 없습니다 !" });
      } else {
        return res.status(200).json({ selectTouristRegion });
      }
    } else {
      // 아무것도 없다면 전체 content정보를 보낸다
      const contentList = await content.find();
      return res.status(200).json({ contentList });
    }
  } catch (err) {
    return res.status(500).json(err);
  }
};
