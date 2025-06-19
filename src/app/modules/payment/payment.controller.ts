import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { paymentService } from "./payment.service";
import config from "../../../config";
import sendResponse from "../../../shared/sendResponse";
import status from "http-status";

const createCheckoutSession = catchAsync(
  async (req: Request, res: Response) => {
    //   const origin = req.headers.origin || config.frontend_base_url || 'https://task-pilot-client-eight.vercel.app';
    const origin: string =
      config.frontend_base_url || "https://task-pilot-client-eight.vercel.app";

    //   console.log(origin);

    const result = await paymentService.createCheckoutSession(req.body, origin);

    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: "Stripe checkout session created successfully",
      data: result,
    });
  }
);

const confirmPayment = catchAsync(async (req: Request, res: Response) => {
  const sessionId = req.query.session_id as string;
  if (!sessionId) throw new Error("Session ID is required");

  const result = await paymentService.confirmPaymentAndSave(sessionId);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Payment confirmed and saved successfully",
    data: result,
  });
});

// Get payment data of a user
const getPaymentsByUserId = catchAsync(async (req: Request, res: Response) => {
  const userId = req.params.userId;

  if (!userId) {
    throw new Error("User ID is required");
  }

  const payments = await paymentService.getPaymentsByUserId(userId);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Payments fetched successfully",
    data: payments,
  });
});

export const paymentController = {
  createCheckoutSession,
  confirmPayment,
  getPaymentsByUserId,
};
