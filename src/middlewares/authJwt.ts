import {NextFunction, Request, Response, Router} from 'express';
import User from '../models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Role from '../models/Role';
import config from "../config";
import { match } from 'assert';
import { userInfo } from 'os';


export const verifyToken = async (req: any, res: Response, next: NextFunction) => {
         
    const token = req.headers["x-access-token"];
    let jwtPayload;
    try {
        jwtPayload = <any>jwt.verify(token, config.SECRET);
        res.locals.jwtPayload = jwtPayload;
      } catch (error) {
        //If token is not valid, respond with 401 (unauthorized)
        res.status(401).json({message: "No token"});
        return;
      }
    
      //The token is valid for 1 hour
      //We want to send a new token on every request
      const { id, username, password } = jwtPayload;
      const user = await User.findById(id);
      if(!user) return res.status(404).json({message: "No user found"});
         
      //Call the next middleware or controller
      next();
}

export const isModerator = async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findById(res.locals.jwtPayload.id);
    const roles = await Role.find({_id: {$in: user.roles}});

    for (let i = 0; i < roles.length; i++) {
        if (roles[i].name == 'moderator' || roles[i].name == 'admin'){
            next();
            return;
        }
    }
    return res.status(403).json({message: "Requires moderator role"});
}

export const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findById(res.locals.jwtPayload.id);
    const roles = await Role.find({_id: {$in: user.roles}});

    for (let i = 0; i < roles.length; i++) {
        if (roles[i].name == 'admin'){
            next();
            return;
        }
    }
    return res.status(403).json({message: "Requires admin role"});
}
