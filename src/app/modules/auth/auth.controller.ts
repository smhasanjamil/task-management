import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { authService } from "./auth.service";
import sendResponse from "../../../shared/sendResponse";
import status from "http-status";

const login = catchAsync(async (req: Request, res: Response) => {
  const { userId , password } = req.body;

  // if (!userId  || !password) {
  //   throw new Error("userId  and password are required");
  // }


  const result = await authService.loginUser(userId , password);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Login successful",
    data: result,
  });
});

export const authController = {
  login,
};
