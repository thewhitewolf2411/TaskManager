import { Router } from 'express';
import WithLogger from '../../../common/classes/withLogger';
import AuthRoutes from './AuthRoutes';
import AuthController from './AuthController';
import AuthRepository from './AuthRepository';
import bcrypt from "bcryptjs";
import db from '@root/src/services/common/db';

class AuthModule extends WithLogger {
    router: Router;
    protectedRouter: Router;
    adminRouter: Router;
    dbinstance: typeof db;
    repo: AuthRepository;
    handlers: AuthController;
    routes: AuthRoutes;

    constructor(router: Router, protectedRouter: Router, adminRouter: Router, dbinstance: typeof db, bcryptModule: typeof bcrypt) {
        super();
        this.router = router;
        this.protectedRouter = protectedRouter;
        this.adminRouter = adminRouter;
        this.dbinstance = dbinstance;

        this.repo = new AuthRepository(this.dbinstance);
        this.handlers = new AuthController(this.repo, bcryptModule);
        this.routes = new AuthRoutes(this.router, this.protectedRouter, this.adminRouter, this.handlers);
    }
}

export default AuthModule;
