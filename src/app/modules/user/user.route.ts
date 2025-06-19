import express, { NextFunction, Request, Response } from "express";
import { userController } from "./user.controller";
import validateRequest from "../../middlewares/validateRequest";
import { UserValidation } from "./user.validation";

const router = express.Router();

router.get("/", userController.getAllUsers);
router.get("/:id", userController.getSingleUser);
router.post(
  "/create",
  validateRequest(UserValidation.userValidationSchema),
  userController.createUser
);

router.patch("/:id", userController.updateUser);

export const userRoutes = router;
