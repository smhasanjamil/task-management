import { UserRole } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { JwtUtils } from "../modules/auth/auth.utils";
import config from "../../config";

const auth = (...role: UserRole[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const token = req.headers.authorization?.split(" ")[1];

            if (!token) {
                throw new Error("Your are not authorized");
            }

            const decoded = JwtUtils.verifyToken(
                token,
                config.jwt_access_secret as string
            );

            if (!role.includes(decoded.role as UserRole)) {
                throw new Error("Your are not authorized");
            }

            req.user = decoded;
            next();
        } catch (error) {
            next(error);
        }
    }
}

export default auth;