import { Request, Response, NextFunction, RequestHandler } from 'express';
import { UserRole } from '@prisma/client';
import status from 'http-status';

// Define allowed roles for project updates
const ALLOWED_UPDATE_ROLES: UserRole[] = [UserRole.admin, UserRole.leader, UserRole.coleader];

export const projectAuth = {
  // Only admin can create projects
  createProject: (req: Request, res: Response, next: NextFunction) => {
    if (req.user?.role !== UserRole.admin) {
      return res.status(status.FORBIDDEN).json({
        success: false,
        message: 'Only admin can create projects',
      });
    }
    next();
  },

  // Admin, leader, and coleader can update projects
  updateProject: (async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    if (!req.user || !ALLOWED_UPDATE_ROLES.includes(req.user.role as UserRole)) {
      res.status(status.FORBIDDEN).json({
        success: false,
        message: 'You are not authorized to update projects',
      });
      return;
    }
    next();
  }) as RequestHandler,

  // Only admin can delete projects
  deleteProject: (req: Request, res: Response, next: NextFunction) => {
    if (req.user?.role !== UserRole.admin) {
      return res.status(status.FORBIDDEN).json({
        success: false,
        message: 'Only admin can delete projects',
      });
    }
    next();
  }
};
