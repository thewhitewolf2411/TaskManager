import { Router } from 'express';
import WithLogger from '../../../common/classes/withLogger';
import TaskRoutes from './TaskRoutes';
import TaskController from './TaskController';
import TaskRepository from './TaskRepository';
import db from '@root/src/services/common/db';

class TaskModule extends WithLogger {
    router: Router;
    protectedRouter: Router;
    adminRouter: Router;
    dbinstance: typeof db;
    repo: TaskRepository;
    handlers: TaskController;
    routes: TaskRoutes;

    constructor(router: Router, protectedRouter: Router, adminRouter: Router, dbinstance: typeof db) {
        super();
        this.router = router;
        this.protectedRouter = protectedRouter;
        this.adminRouter = adminRouter;
        this.dbinstance = dbinstance;

        this.repo = new TaskRepository(this.dbinstance);
        this.handlers = new TaskController(this.repo);
        this.routes = new TaskRoutes(this.router, this.protectedRouter, this.adminRouter, this.handlers);
    }
}

export default TaskModule;
