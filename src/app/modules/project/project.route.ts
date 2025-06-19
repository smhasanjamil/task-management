import { Router } from "express";
import { projectController } from "./project.controller";
import validateRequest from "../../middlewares/validateRequest";
import { ProjectValidation } from "./project.validation";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = Router();

// Create project - only admin
router.post("/create",
    auth(UserRole.admin),
    validateRequest(ProjectValidation.createProjectZodSchema),
    projectController.createProject
);

// Get projects - all authenticated users
router.get('/', auth(UserRole.admin, UserRole.leader, UserRole.coleader, UserRole.member), projectController.getAllProjects);
router.get('/:id', auth(UserRole.admin, UserRole.leader, UserRole.coleader, UserRole.member), projectController.getSingleProject);

// Update project - admin, leader, coleader
router.patch('/:id',
    auth(UserRole.admin, UserRole.leader, UserRole.coleader),
    validateRequest(ProjectValidation.updateProjectZodSchema),
    projectController.updateProject
);

// Delete project - only admin
router.delete('/:id',
    auth(UserRole.admin),
    projectController.deleteProject
);

export const projectRoutes = router;