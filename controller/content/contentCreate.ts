import { content } from "../../models/content";
import { item } from "../../models/item";
import { Request, Response, NextFunction } from "express";

export default async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  try {
    // schedule: [[{item},{item}],[{item},{item}],[{item},{item},{item}]]
    const {
      startDate,
      endDate,
      totalCost,
      schedule,
      thumbnail,
      touristSpot,
      title,
      touristRegion,
    } = req.body;
    // [[경복궁,남산],[강남],[서울]]
    const userId = res.locals.id;
    if (!userId) {
      return res.status(401).json({ message: "로그인 상태가 아닙니다 !" });
    } else {
      if (schedule) {
        // 스케줄에 있는 아이템들을 따로 아이템 필드안에 집어 넣는다.
        // const idArr: any = [];
        let allIdArr: any = [];
        for (let i = 0; i < schedule.length; i++) {
          const lib: any = [];
          for (let data of schedule[i]) {
            const idArr: any = [];
            const itemCost = await item.find({ place: data.place });
            if (itemCost.length === 0) {
              const newItems = item.build({
                place: data.place,
                price: data.price,
                averagePrice: 0,
                category: data.category,
                img: data.img,
                mapx: data.mapx,
                mapy: data.mapy,
                detail: data.detail,
                tel: data.tel,
                address: data.address,
                contentId: data.contentId,
                userinfo: userId,
              });
              // console.log("newItems성공 !", newItems);
              await newItems
                .save()
                .then((data) => data)
                .then((data) => {
                  idArr.push(data._id);
                  req.params.itemId = data._id;
                });
              // console.log(idArr);
            } else {
              // const idArr: any = [];
              //  db에 place가 존재한다면 평균값을 구해야한다
              // 장소별로 가격을 배열안에 넣는다
              const itemCostArr: number[] = [];
              itemCost.filter((el) => {
                if (el.price) {
                  return itemCostArr.push(el.price);
                }
              });
              // console.log(itemCostArr);
              // // 배열안에 있는 아이템별 비용의 합계를 구한다
              const totalItemCost = itemCostArr.reduce(
                (acc: number, cur: number) => {
                  acc += cur;
                  return acc;
                },
                0
              );
              // console.log(totalItemCost);
              // 비용의 평균을 내고 반올림한다
              const averageItemCost = Math.floor(
                totalItemCost / itemCostArr.length
              );
              // console.log(averageItemCost);
              const newItems = item.build({
                place: data.place,
                price: data.price,
                averagePrice: averageItemCost,
                category: data.category,
                img: data.img,
                mapx: data.mapx,
                mapy: data.mapy,
                detail: data.detail,
                tel: data.tel,
                address: data.address,
                contentId: data.contentId,
                userinfo: userId,
              });
              // console.log("newItems성공 !", newItems);
              await newItems
                .save()
                .then((data) => data)
                .then((data) => {
                  idArr.push(data._id);
                  req.params.itemId = data._id;
                });
            }
            for (let el of idArr) {
              lib.push(el);
            }
          }
          allIdArr.push(lib);
        }
        console.log("allIdArr!!!!!", allIdArr);
        const newContent = content.build({
          startDate: startDate,
          endDate: endDate,
          thumbnail: thumbnail,
          totalCost: totalCost,
          title: title,
          touristRegion: touristRegion,
          schedule: allIdArr,
          touristSpot: touristSpot,
          userinfo: userId,
        });
        await newContent.save();
        res.status(201).json({ message: "컨텐츠 작성 완료 !" });
        req.params.id = newContent._id;
      } else {
        return res.status(400).json({ message: "스케줄이 비어있습니다 !" });
      }
    }
  } catch (err) {
    return res.status(500).json(err);
  }
};
