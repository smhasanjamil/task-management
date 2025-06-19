import Stripe from "stripe";
import { PrismaClient } from "@prisma/client";
import config from "../../../config";

const prisma = new PrismaClient();

const stripe = new Stripe(config.stripe_secret_key as string, {
  apiVersion: "2023-10-16" as Stripe.LatestApiVersion,
});

interface IPaymentPayload {
  productName: string;
  amount: number;
  userId: string;
}

const createCheckoutSession = async (
  payload: IPaymentPayload,
  origin: string
) => {
  const { productName, amount, userId } = payload;
  if (!productName || !amount || !userId) {
    throw new Error("Product name, amount, and userId are required");
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    metadata: { userId, productName, amount: amount.toString() },
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: { name: productName },
          unit_amount: amount,
        },
        quantity: 1,
      },
    ],
    success_url: `${origin}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/cancel`,
  });

  return { url: session.url };
};

const confirmPaymentAndSave = async (sessionId: string) => {
  const session = await stripe.checkout.sessions.retrieve(sessionId);

  if (session.payment_status !== "paid") {
    throw new Error("Payment not successful");
  }

  const { userId, productName, amount } = session.metadata || {};
  if (!userId || !productName || !amount) {
    throw new Error("Missing metadata");
  }

  const saved = await prisma.payment.create({
    data: {
      stripeSessionId: sessionId,
      productName,
      amount: Number(amount),
      status: "paid",
      userId,
    },
  });

  return saved;
};

// Get user payment data
const getPaymentsByUserId = async (userId: string) => {
  const payments = await prisma.payment.findMany({
    where: {
      userId,
    },
    orderBy: {
       // optional: latest first
      createdAt: "desc",
    },
  });

  return payments;
};

export const paymentService = {
  createCheckoutSession,
  confirmPaymentAndSave,
  getPaymentsByUserId,
};
