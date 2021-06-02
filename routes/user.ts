import express from "express";
const router = express.Router();

const { userController } = require("../controller");

router.post("/signup", userController.signup);
router.post("/login", userController.login);
router.post("/oauth", userController.oauth);
router.post("/findPw", userController.findPw);
router.post("/findEmail", userController.findEmail);

export default router;
