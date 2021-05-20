import { Request, Response, NextFunction } from "express";
import axios from "axios";
import "dotenv/config";

export default async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  try {
    // 관광사진갤러리 상세 목록 조회
    console.log(req.body.title);
    const { title, num } = req.body;
    const serviceKey = process.env.SERVICE_KEY;
    const url = `http://api.visitkorea.or.kr/openapi/service/rest/PhotoGalleryService/galleryDetailList?ServiceKey=${serviceKey}&MobileOS=ETC&MobileApp=AppTesting&title=${encodeURIComponent(
      title
    )}&pageNo=${num}&numOfRows=10&_type=json`;

    axios.get(url).then((data) => {
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.json(data.data.response.body.items);
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
};
