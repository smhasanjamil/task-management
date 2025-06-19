import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { teamService } from "./team.service";
import sendResponse from "../../../shared/sendResponse";
import status from "http-status";


//create team
const createTeam = catchAsync(async (req: Request, res: Response) => {
    const payload = req.body;
    const result = await teamService.createTeamIntoDB(payload);

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'Team created Successfully',
        data: result,
    });
});

//get all team
const getAllTeams = catchAsync(async (req: Request, res: Response) => {
    const result = await teamService.getAllTeamsFromDB();

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Team retrieved successfully",
        data: result,
    })
})

//============get single team===========
const getSingleTeam = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await teamService.getSingleTeamFromDB(id);

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Team retrieved successfully",
        data: result,
    })
})

//delete team
const deleteTeam = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await teamService.deleteTeamFromDB(id);

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Team deleted Successfully",
        data: result
    })
})

//update team
const updateTeam = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const payload = req.body;
    const result = await teamService.updateTeamInDB(id, payload);

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Team updated successfully",
        data: result
    })
})

export const teamController = {
    createTeam,
    deleteTeam,
    getAllTeams,
    updateTeam,
    getSingleTeam
}