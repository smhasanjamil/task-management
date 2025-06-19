import { Request, Response } from "express";
import sendResponse from "../../../shared/sendResponse";
import catchAsync from "../../../shared/catchAsync";
import status from "http-status";
import { userService } from "./user.service";

// Create user
const createUser = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const result = await userService.createUserIntoDB(payload);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "User Created successfully",
    data: result,
  });
});

// Get all user
const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const result = await userService.getAllUsersFromDB();

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Users retrieved successfully",
    data: result,
  });
});

// Get single user
const getSingleUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await userService.getSingleUserFromDB(id);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "User retrieved successfully",
    data: result,
  });
});

// Update User
const updateUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const payload = req.body;

  const result = await userService.updateUserInDB(id, payload);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "User updated successfully",
    data: result,
  });
});

export const userController = {
  createUser,
  getAllUsers,
  getSingleUser,
  updateUser,
};
