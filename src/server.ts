import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import mongoose from 'mongoose';
import compression from 'compression';
import cors from 'cors';

import indexRoutes from './routes/indexRoutes';
import PostRoutes from './routes/PostRoutes';
import UserRoutes from './routes/UserRoutes';
import authRoutes from './routes/authRoutes';
import { createRoles } from './libs/initialSetup';
import User from './models/User';

class Server{
    public app: express.Application;

    constructor() {
        this.app = express();
        createRoles();
        this.config();
        this.routes();
    }

    config() {
        const MONGO_URI = 'mongodb://localhost/JWTapi';
        mongoose.connect(MONGO_URI || process.env.MONGODB_URL)
            .then(db => console.log('DB is connected'));
        //Settings
        this.app.set('port', process.env.PORT || 3000);
        //Middlewares
        this.app.use(morgan('dev'));
        this.app.use(express.json());
        this.app.use(express.urlencoded({extended: false}));
        this.app.use(helmet());
        this.app.use(compression());
        this.app.use(cors());
    }

    routes() {
        this.app.use(indexRoutes);
        this.app.use('/api/posts', PostRoutes);
        this.app.use('/api/users', UserRoutes);
        this.app.use('/api/auth', authRoutes);
    }

    start(){
        this.app.listen(this.app.get('port'), () => {
            //console.log( 'Server on port', this.app.get('port'));
            console.log('Server on: http://localhost:' + this.app.get('port'));
        });
    }

}

const server = new Server();
server.start();