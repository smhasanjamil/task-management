import express, { NextFunction, Request, Response } from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { TeamValidation } from "./team.validation";
import { teamController } from "./team.controller";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.post(
    "/create",
    auth(UserRole.admin, UserRole.leader),
    validateRequest(TeamValidation.createTeamValidationSchema),
    teamController.createTeam
);

router.get("/", teamController.getAllTeams)

router.get("/:id", teamController.getSingleTeam)

router.delete(
    "/:id",
    auth(UserRole.admin, UserRole.leader),
    teamController.deleteTeam
)

router.patch(
    "/:id",
    auth(UserRole.admin, UserRole.leader),
    validateRequest(TeamValidation.updateTeamValidationSchema),
    teamController.updateTeam
)

export const teamRoutes = router;