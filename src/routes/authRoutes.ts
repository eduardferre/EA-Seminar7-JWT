import {NextFunction, Request, Response, Router} from 'express';
import User from '../models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Role from '../models/Role';
import { ROLES } from '../models/Role';
import config from "../config";
import { match } from 'assert';


class AuthRoutes{

    router: Router;

    constructor() {
        this.router = Router();
        this.routes();
    }

    public async register(req: Request, res: Response){
        const {name, email, password, username, roles} = req.body;

        //encrypt password
        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(password, salt);
        const newUser = new User({name, email, password: hashed, username, roles});
    
        if (roles) {
            for (let i = 0; i < roles.length; i++){
                if(!ROLES.includes(roles[i])){
                    return res.status(400).json({message: 'Roles do not exist'});
                }
            }
            const foundRoles = await Role.find({name: {$in: roles}});
            newUser.roles = foundRoles.map(role => role._id);
        } else{
            const userrole = await Role.findOne({name: 'user'});          
            newUser.roles = [userrole._id];
        }
        //if the user specifies his roles, we search these roles on the database

        const savedUser = await newUser.save();
        const token = jwt.sign({id: savedUser._id, username: savedUser.username}, config.SECRET,{
            expiresIn: 3600 //seconds
        });
        res.status(200).json({token});
    }

    public async login(req: Request, res: Response) {
        const userFound = await User.findOne({email: req.body.email}).populate('roles');
        if(!userFound) return res.status(400).json({message: "User not found"});

        const matchPassword = await bcrypt.compare(req.body.password, userFound.password);
        if(!matchPassword) return res.status(401).json({token: null, message: "Ivalid password"});

        const token = jwt.sign({id: userFound._id, username: userFound.username}, config.SECRET, {
            expiresIn: 3600
        });

        res.json({token: token});

    }
   
    public async comparePassword(password: any, recievedPassword: any){
        return await bcrypt.compare(password, recievedPassword); //returns true if passwords coincide
    }

    routes() {
        this.router.post('/register', this.register);
        this.router.post('/login', this.login);
    }

}



const authRoutes = new AuthRoutes();

export default authRoutes.router;