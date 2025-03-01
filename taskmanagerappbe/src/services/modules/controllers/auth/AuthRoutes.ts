import { Request, Response, NextFunction, Router } from 'express';
import AuthRepository from './AuthRepository';

class AuthRoutes {

  private router: Router;
  private protectedRouter: Router;
  private adminRouter: Router;
  private handlers

  constructor(router: Router, protectedRouter: Router, adminRouter: Router, handlers: any) {
    this.router = router
    this.protectedRouter = protectedRouter
    this.adminRouter = adminRouter
    this.handlers = handlers

    this.router.route("/auth/login").post((req: Request, res: Response, next: NextFunction) => this.handlers.loginHandler(req, res).catch(next))
    this.router.route("/auth/register").post((req: Request, res: Response, next: NextFunction) => this.handlers.registerHandler(req, res).catch(next))
    this.protectedRouter.route("/auth/logout").get((req: Request, res: Response, next: NextFunction) => this.handlers.logoutHandler(req, res).catch(next))
  }
}

export default AuthRoutes
