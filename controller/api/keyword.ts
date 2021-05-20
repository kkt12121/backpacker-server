import { Request, Response, NextFunction } from "express";
import axios from "axios";
import "dotenv/config";

export default async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  try {
    // 관광사진갤러리 키워드 조회
    console.log(req.body.keyword);
    const { keyword, num } = req.body;
    const serviceKey = process.env.SERVICE_KEY;
    const url = `http://api.visitkorea.or.kr/openapi/service/rest/PhotoGalleryService/gallerySearchList?ServiceKey=${serviceKey}&MobileOS=ETC&MobileApp=AppTesting&keyword=${encodeURIComponent(
      keyword
    )}&pageNo=${num}&numOfRows=10&_type=json`;

    axios.get(url).then((data) => {
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.json(data.data.response.body);
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
};
