import { Request, Response, NextFunction, Router } from 'express';
import UserRepository from './UserRepository';

class UserRoutes {

  private router: Router;
  private protectedRouter: Router;
  private adminRouter: Router;
  private handlers

  constructor(router: Router, protectedRouter: Router, adminRouter: Router, handlers: any) {
    this.router = router
    this.protectedRouter = protectedRouter
    this.adminRouter = adminRouter
    this.handlers = handlers

    this.protectedRouter.route("/user")
      .get((req: Request, res: Response, next: NextFunction) => this.handlers.getCurrentUserHandler(req, res).catch(next))
      .put((req: Request, res: Response, next: NextFunction) => this.handlers.modifyCurrentUserHandler(req, res).catch(next))
      .delete((req: Request, res: Response, next: NextFunction) => this.handlers.deleteCurrentUserHandler(req, res).catch(next))

    this.adminRouter.route("/users").get((req: Request, res: Response, next: NextFunction) => this.handlers.getAllUsers(req, res).catch(next))
    this.adminRouter.route("/user/create").post((req: Request, res: Response, next: NextFunction) => this.handlers.createUser(req, res).catch(next))
    this.adminRouter.route("/user/:userId")
      .get((req: Request, res: Response, next: NextFunction) => this.handlers.getUserByIdHandler(req, res).catch(next))
      .put((req: Request, res: Response, next: NextFunction) => this.handlers.modifyUserByIdHandler(req, res).catch(next))
      .delete((req: Request, res: Response, next: NextFunction) => this.handlers.deleteUserByIdHandler(req, res).catch(next))
  }
}

export default UserRoutes
