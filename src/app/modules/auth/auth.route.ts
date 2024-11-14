import { Router } from "express";
import { userController } from "./auth.controller";
const route = Router();

route.post("/signup", userController.createUser);

route.post("/signin", userController.loginUser);
route.post("/refresh-token", userController.refreshToken);

export const authRouter = route;
