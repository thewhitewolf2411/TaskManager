import { Request, Response, NextFunction, Router } from 'express';

class TaskRoutes {

  private router
  private protectedRouter
  private adminRouter
  private handlers

  constructor(router: Router, protectedRouter: Router, adminRouter: Router, handlers: any) {
    this.router = router
    this.protectedRouter = protectedRouter
    this.adminRouter = adminRouter
    this.handlers = handlers

    this.protectedRouter.route("/tasks")
      .get((req: Request, res: Response, next: NextFunction) => this.handlers.getTasks(req, res).catch(next))

    this.protectedRouter.route("/task")
      .post((req: Request, res: Response, next: NextFunction) => this.handlers.createTask(req, res).catch(next));

    this.protectedRouter.route("/task/:taskId")
      .put((req: Request, res: Response, next: NextFunction) => this.handlers.updateTask(req, res).catch(next))
      .delete((req: Request, res: Response, next: NextFunction) => this.handlers.deleteTask(req, res).catch(next));

    this.protectedRouter.route("/task/:taskId/status")
      .put((req: Request, res: Response, next: NextFunction) => this.handlers.updateTaskStatus(req, res).catch(next))

    this.protectedRouter.route("/task/:taskId/priority")
      .put((req: Request, res: Response, next: NextFunction) => this.handlers.changeTaskPriority(req, res).catch(next));

    this.protectedRouter.route("/task/comment/:taskId")
      .post((req: Request, res: Response, next: NextFunction) => this.handlers.addComment(req, res).catch(next));

    this.protectedRouter.route("/task/comment/:commentId")
      .put((req: Request, res: Response, next: NextFunction) => this.handlers.modifyComment(req, res).catch(next))
      .delete((req: Request, res: Response, next: NextFunction) => this.handlers.deleteComment(req, res).catch(next));
  }
}

export default TaskRoutes
