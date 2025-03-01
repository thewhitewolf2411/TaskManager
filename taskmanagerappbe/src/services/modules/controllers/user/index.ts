import { Router } from 'express';
import WithLogger from '../../../common/classes/withLogger';
import UserRoutes from './UserRoutes';
import UserController from './UserController';
import UserRepository from './UserRepository';
import bcrypt from "bcryptjs";
import db from '@root/src/services/common/db';

class UserModule extends WithLogger {
    router: Router;
    protectedRouter: Router;
    adminRouter: Router;
    dbinstance: typeof db;
    repo: UserRepository;
    handlers: UserController;
    routes: UserRoutes;

    constructor(router: Router, protectedRouter: Router, adminRouter: Router, dbinstance: typeof db, bcryptModule: typeof bcrypt) {
        super();
        this.router = router;
        this.protectedRouter = protectedRouter;
        this.adminRouter = adminRouter;
        this.dbinstance = dbinstance;

        this.repo = new UserRepository(this.dbinstance);
        this.handlers = new UserController(this.repo, bcryptModule);
        this.routes = new UserRoutes(this.router, this.protectedRouter, this.adminRouter, this.handlers);
    }
}

export default UserModule;
