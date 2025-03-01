import request from "supertest";
import express, { Router, Application } from "express";
import TaskRoutes from "../services/modules/controllers/task/TaskRoutes";

describe("TaskRoutes", () => {
  let app: Application;
  let handlers: any;

  beforeEach(() => {
    handlers = {
      getTasks: jest.fn().mockResolvedValue({}),
      createTask: jest.fn().mockResolvedValue({}),
      updateTask: jest.fn().mockResolvedValue({}),
      deleteTask: jest.fn().mockResolvedValue({}),
      updateTaskStatus: jest.fn().mockResolvedValue({}),
      changeTaskPriority: jest.fn().mockResolvedValue({}),
      addComment: jest.fn().mockResolvedValue({}),
      modifyComment: jest.fn().mockResolvedValue({}),
      deleteComment: jest.fn().mockResolvedValue({}),
    };

    const router = Router();
    const protectedRouter = Router();
    const adminRouter = Router();

    new TaskRoutes(router, protectedRouter, adminRouter, handlers);

    app = express();
    app.use(express.json());
    app.use("/", router);
    app.use("/", protectedRouter);
    app.use("/", adminRouter);
  });

  it("should call getTasks on GET /tasks", async () => {
    await request(app).get("/tasks");
    expect(handlers.getTasks).toHaveBeenCalled();
  });

  it("should call createTask on POST /task", async () => {
    await request(app).post("/task").send({ title: "New Task" });
    expect(handlers.createTask).toHaveBeenCalled();
  });

  it("should call updateTask on PUT /task/:taskId", async () => {
    await request(app).put("/task/123").send({ title: "Updated Task" });
    expect(handlers.updateTask).toHaveBeenCalled();
  });

  it("should call deleteTask on DELETE /task/:taskId", async () => {
    await request(app).delete("/task/123");
    expect(handlers.deleteTask).toHaveBeenCalled();
  });

  it("should call updateTaskStatus on PUT /task/:taskId/status", async () => {
    await request(app).put("/task/123/status").send({ status: "completed" });
    expect(handlers.updateTaskStatus).toHaveBeenCalled();
  });

  it("should call changeTaskPriority on PUT /task/:taskId/priority", async () => {
    await request(app).put("/task/123/priority").send({ priority: "High" });
    expect(handlers.changeTaskPriority).toHaveBeenCalled();
  });

  it("should call addComment on POST /task/:taskId/comment", async () => {
    await request(app).post("/task/123/comment").send({ text: "Nice work!" });
    expect(handlers.addComment).toHaveBeenCalled();
  });

  it("should call modifyComment on PUT /comment/:commentId", async () => {
    await request(app).put("/comment/456").send({ text: "Updated comment" });
    expect(handlers.modifyComment).toHaveBeenCalled();
  });

  it("should call deleteComment on DELETE /comment/:commentId", async () => {
    await request(app).delete("/comment/456");
    expect(handlers.deleteComment).toHaveBeenCalled();
  });
});
