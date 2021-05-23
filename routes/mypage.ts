import express from "express";
const router = express.Router();
import checkToken from "./checkToken";

const { mypageController } = require("../controller");

router.get("/userInfo", checkToken, mypageController.userInfo);
router.get("/userContent", checkToken, mypageController.userContent);
router.put("/userUpdate", checkToken, mypageController.userUpdate);
router.delete("/userDelete", checkToken, mypageController.userDelete);
router.post("/logout", checkToken, mypageController.logout);

export default router;
