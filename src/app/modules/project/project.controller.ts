import { Request, Response, RequestHandler } from "express";
import catchAsync from "../../../shared/catchAsync";
import { projectService } from "./project.service";
import sendResponse from "../../../shared/sendResponse";
import status from "http-status";

//===============create a Project===============
const createProject: RequestHandler = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const payload = req.body;
    const result = await projectService.createProjectIntoDB(payload);

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'Project created Successfully',
        data: result
    });
});

//==========get all Projects===========
const getAllProjects: RequestHandler = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const result = await projectService.getAllProjectsfromDB();

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Projects retrieved successfully",
        data: result
    });
});

//============get single Project ===========
const getSingleProject: RequestHandler = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const result = await projectService.getSingleProjectFromDB(id);

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Project retrieved successfully",
        data: result
    });
});

//============update Project ==============
const updateProject = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const payload = req.body;
    const userId = req.user?.userId;
    const userRole = req.user?.role;

    if (!userId || !userRole) {
        throw new Error("User information not found");
    }

    const result = await projectService.updateProjectInDB(id, payload, userId, userRole);

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Project updated Successfully",
        data: result
    });
});

//===========delete a Project =============
const deleteProject: RequestHandler = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const result = await projectService.deleteProjectFromDB(id);

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Project deleted successfully",
        data: result
    });
});

export const projectController = {
    createProject,
    getAllProjects,
    updateProject,
    deleteProject,
    getSingleProject
};