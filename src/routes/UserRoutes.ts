import {Request, Response, Router} from 'express';
import User from '../models/User';
import {authJwt} from '../middlewares/index';
import { ROLES } from '../models/Role';

class UserRoutes{

    router: Router;

    constructor() {
        this.router = Router();
        this.routes();
    }

    public async getUsers(req: Request, res: Response): Promise<void> {
        const users = await User.find().populate(`posts`, '-_id -__v');
        res.status(200).send(users);
    }

    public async getUser(req: Request, res: Response): Promise<void> { 
        
        const user = await User.findOne({username: req.params.username}).populate('posts', '-_id -__v');
        //const user: User | null = await UserModel.findOne({ username: req.params.username}).populate('posts', '-_id -__v');
        res.json(user);
    }

    public async createUser(req: Request, res: Response) { 
        const newUser = new User(req.body);
        await newUser.save();
        res.json({data: newUser});
    }

    public async updateUser(req: Request, res: Response): Promise<void> {
        const {username} = req.params;
        const user = await User.findOneAndUpdate({username}, req.body, {new: true});
        res.json(user);
    }

    public async deleteUser(req: Request, res: Response): Promise<void> {
        const {username} = req.params;
        await User.findOneAndDelete({username});
        res.json({response: 'User Deletedd successfully'});
    }

    routes() {
        this.router.get('/', this.getUsers);
        this.router.get('/:username', authJwt.verifyToken, this.getUser);
        this.router.post('/', [authJwt.verifyToken, authJwt.isModerator], this.createUser);
        this.router.put('/:username',[authJwt.verifyToken, authJwt.isModerator], this.updateUser);
        this.router.delete('/:username',[authJwt.verifyToken, authJwt.isAdmin], this.deleteUser);
    }
}

const userRoutes = new UserRoutes();
export default userRoutes.router;