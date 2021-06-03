import { content } from "../../models/content";
import { item } from "../../models/item";
import { user } from "../../models/user";
import { Request, Response, NextFunction } from "express";

export default async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  try {
    // console.log(req.params.id);
    if (!req.params.id) {
      return res.status(400).json({ message: "존재하지 않는 게시물 입니다 !" });
    } else {
      // 해당하는 content를 찾는다
      const findContent: any = await content.findOne({ _id: req.params.id });
      // 현재 startDate와 endDate를 yyyy-mm-dd 형태로 변환해서 클라이언트로 보내준다.
      const getFormatDate: any = (date: any) => {
        var year = date.getFullYear(); //yyyy
        var month = 1 + date.getMonth(); //M
        month = month >= 10 ? month : "0" + month; //month 두자리로 저장
        var day = date.getDate(); //d
        day = day >= 10 ? day : "0" + day; //day 두자리로 저장
        return year + "/" + month + "/" + day; //'-' 추가하여 yyyy-mm-dd 형태 생성 가능
      };
      // startDate
      let objStartDate = new Date(findContent.startDate);
      objStartDate = getFormatDate(objStartDate);
      // endDate
      let objEndDate = new Date(findContent.endDate);
      objEndDate = getFormatDate(objEndDate);

      const contentInfo = {
        startDate: objStartDate,
        endDate: objEndDate,
        totalCost: findContent.totalCost,
        thumbnail: findContent.thumbnail,
        title: findContent.title,
        touristRegion: findContent.touristRegion,
      };

      // content를 작성한 user를 찾는다.
      const userArr = findContent.userinfo;
      const userInfo: any = [];
      for (let id of userArr) {
        const findUser = await user.find({ _id: id });
        userInfo.push(...findUser);
      }
      // content안에 있는 item들을 찾는다.
      // schedule안에 있는 item id를 찾아서 db에 저장된 item과 일치하는것을
      // itemArr에 담아서 보낸준다.
      const itemIdArr = findContent.schedule;
      let itemArr: any = [];
      for (let i = 0; i < itemIdArr.length; i++) {
        const test = [];
        for (let el of itemIdArr[i]) {
          const findItem = await item.find({ _id: el });
          test.push(...findItem);
        }
        itemArr.push(test);
      }
      return res.status(200).json({ contentInfo, userInfo, itemArr });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
};
