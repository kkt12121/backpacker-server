import express from "express";
const router = express.Router();
import auth from "./auth";

const { mypageController } = require("../controller");

router.get("/userInfo", auth, mypageController.userInfo);
router.get("/userContent", auth, mypageController.userContent);
router.put("/userUpdate", auth, mypageController.userUpdate);
router.delete("/userDelete", auth, mypageController.userDelete);
router.post("/logout", auth, mypageController.logout);

export default router;
