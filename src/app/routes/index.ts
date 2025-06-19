import express from "express";
import { userRoutes } from "../modules/user/user.route";
import { authRoutes } from "../modules/auth/auth.route";
import { teamRoutes } from "../modules/team/team.route";
import { paymentRoutes } from "../modules/payment/payment.route";
import { projectRoutes } from "../modules/project/project.route";
import { chatRoutes } from "../modules/chat/chat.route";

const router = express.Router();

const moduleRoutes = [
  {
    path: "/user",
    route: userRoutes,
  },
  {
    path: "/auth",
    route: authRoutes,
  },
  {
    path: "/team",
    route: teamRoutes,
  },
  {
    path: "/payment",
    route: paymentRoutes,
  },
  {
    path: "/project",
    route: projectRoutes,
  },
  {
    path: "/chat",
    route: chatRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
