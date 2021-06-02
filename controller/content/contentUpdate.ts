import { content } from "../../models/content";
import { item } from "../../models/item";
import { Request, Response, NextFunction } from "express";

export default async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  try {
    const {
      startDate,
      endDate,
      totalCost,
      thumbnail,
      schedule,
      title,
      touristRegion,
    } = req.body;
    const contentId = req.params.id;
    const userId = res.locals.id;
    const checkContent: any = await content.findOne({ _id: contentId });
    if (checkContent.length !== 0) {
      if (userId) {
        // 새로운 스케줄이 왔다.
        // 근데 스케줄에 기존에 작성했던 아이템이 아닌 새로운 아이템이 왔다면?
        // 새로 만들어 줘야하는데 어떻게?
        // 기존에 있던 모든 item을 다지우고 수정하기 버튼을 누르면
        // 다시 아이템을 만들면 될까?
        const findContent: any = await content.findOne({
          $and: [
            { _id: contentId },
            {
              userinfo: { $in: [userId] },
            },
          ],
        });
        const itemArr = findContent.schedule;
        const allItemArr = [];
        for (let el of itemArr) {
          for (let id of el) {
            allItemArr.push(id);
          }
        }
        console.log(allItemArr);
        for (let i = 0; i < allItemArr.length; i++) {
          await item.deleteOne({ _id: allItemArr[i] });
        }
        // 현재 컨텐츠안에 아이템들이 db에서 다 지워졌다.
        // 그다음 새로받은 스케줄에 있는 아이템을 새로 만들어보자
        let allIdArr: any = [];
        for (let i = 0; i < schedule.length; i++) {
          const result: any = [];
          for (let data of schedule[i]) {
            const idArr: any = [];
            const itemCost = await item.find({ place: data.place });
            if (itemCost.length === 0) {
              const newItems = item.build({
                place: data.place,
                price: data.price,
                averagePrice: data.price,
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
              await newItems
                .save()
                .then((data) => data)
                .then((data) => {
                  idArr.push(data._id);
                  req.params.itemId = data._id;
                });
            } else {
              //  db에 place가 존재한다면 평균값을 구해야한다
              // 장소별로 가격을 배열안에 넣는다
              const itemCostArr: number[] = [];
              itemCost.filter((el) => {
                if (el.price) {
                  return itemCostArr.push(el.price);
                }
              });
              // // 배열안에 있는 아이템별 비용의 합계를 구한다
              const totalItemCost = itemCostArr.reduce(
                (acc: number, cur: number) => {
                  acc += cur;
                  return acc;
                },
                0
              );
              // 비용의 평균을 내고 반올림한다
              const averageItemCost = Math.floor(
                totalItemCost / itemCostArr.length
              );
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
              await newItems
                .save()
                .then((data) => data)
                .then((data) => {
                  idArr.push(data._id);
                  req.params.itemId = data._id;
                });
            }
            for (let el of idArr) {
              result.push(el);
            }
          }
          allIdArr.push(result);
        }

        // 그후 수정된 content 내용을 업데이트 시켜준다.
        await content.updateMany(
          {
            $and: [
              { _id: contentId },
              {
                userinfo: { $in: [userId] },
              },
            ],
          },
          {
            $set: {
              startDate: startDate,
              endDate: endDate,
              totalCost: totalCost,
              thumbnail: thumbnail,
              schedule: allIdArr,
              title: title,
              touristRegion: touristRegion,
            },
          },
          { multi: true }
        );
        res.status(200).json({ message: "게시물을 수정하였습니다 !" });
      } else {
        return res.status(401).json({ message: "로그인 상태가 아닙니다 !" });
      }
    } else {
      return res.status(400).json({ message: "존재하지 않는 게시물 입니다 !" });
    }
  } catch (err) {
    return res.status(500).json(err);
  }
};
