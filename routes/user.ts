import express from "express";
const router = express.Router();
import checkToken from "./checkToken";

const { userController } = require("../controller");

router.get("/", checkToken);
router.post("/signup", userController.signup);
router.post("/login", userController.login);
router.post("/oauth", userController.oauth);
router.post("/findPw", userController.findPw);
router.post("/findEmail", userController.findEmail);

export default router;
