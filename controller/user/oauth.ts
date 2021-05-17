import { Request, Response, NextFunction } from "express";
import axios from "axios";
import { user } from "../../models/user";
import dotenv from "dotenv";
dotenv.config();

export default async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  // 아직 완성하지 못했습니다 !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  console.log(req.body.authorizationCode);
  if (req.body.authorizationCode) {
    const clientID = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const url = "https://accounts.google.com/o/oauth2/token";

    await axios({
      method: "POST",
      url: url,
      headers: {
        "Content-Type": "application/json",
      },
      params: {
        client_id: clientID,
        client_secret: clientSecret,
        code: req.body.authorizationCode,
        grant_type: "authorization_code",
        redirect_uri: "https://localhost:4000/user/oauth",
      },
    })
      .then((response) => {
        console.log(response.data.access_token);
      })
      .catch((err) => {
        return err;
      });
  }
};
