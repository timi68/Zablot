import UserController from "@lib/controllers/userController";
import { verifyBearerToken } from "@security/verifyBearerToken";
import express from "express";

const userRouter = express.Router();
userRouter.use(verifyBearerToken);

const userRoot = userRouter.route("/");

userRoot.get(UserController.getUser).patch(UserController.updateUser);

export default userRouter;
