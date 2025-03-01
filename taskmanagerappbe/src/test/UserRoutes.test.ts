import request from "supertest";
import express, { Router, Application } from "express";
import UserRoutes from "../services/modules/controllers/user/UserRoutes";

describe("UserRoutes", () => {
  let app: Application;
  let handlers: any;

  beforeEach(() => {
    handlers = {
      getCurrentUserHandler: jest.fn().mockResolvedValue({}),
      modifyCurrentUserHandler: jest.fn().mockResolvedValue({}),
      deleteCurrentUserHandler: jest.fn().mockResolvedValue({}),
      getAllUsers: jest.fn().mockResolvedValue({}),
      createUser: jest.fn().mockResolvedValue({}),
      getUserByIdHandler: jest.fn().mockResolvedValue({}),
      modifyUserByIdHandler: jest.fn().mockResolvedValue({}),
      deleteUserByIdHandler: jest.fn().mockResolvedValue({}),
    };

    const router = Router();
    const protectedRouter = Router();
    const adminRouter = Router();

    new UserRoutes(router, protectedRouter, adminRouter, handlers);

    app = express();
    app.use(express.json());
    app.use("/", router);
    app.use("/", protectedRouter);
    app.use("/", adminRouter);
  });

  it("should call getCurrentUserHandler on GET /user", async () => {
    await request(app).get("/user");
    expect(handlers.getCurrentUserHandler).toHaveBeenCalled();
  });

  it("should call modifyCurrentUserHandler on PUT /user", async () => {
    await request(app).put("/user").send({ name: "New Name" });
    expect(handlers.modifyCurrentUserHandler).toHaveBeenCalled();
  });

  it("should call deleteCurrentUserHandler on DELETE /user", async () => {
    await request(app).delete("/user");
    expect(handlers.deleteCurrentUserHandler).toHaveBeenCalled();
  });

  it("should call getAllUsers on GET /users", async () => {
    await request(app).get("/users");
    expect(handlers.getAllUsers).toHaveBeenCalled();
  });

  it("should call createUser on POST /user/create", async () => {
    await request(app).post("/user/create").send({ name: "John Doe" });
    expect(handlers.createUser).toHaveBeenCalled();
  });

  it("should call getUserByIdHandler on GET /user/:userId", async () => {
    await request(app).get("/user/123");
    expect(handlers.getUserByIdHandler).toHaveBeenCalled();
  });

  it("should call modifyUserByIdHandler on PUT /user/:userId", async () => {
    await request(app).put("/user/123").send({ name: "Updated Name" });
    expect(handlers.modifyUserByIdHandler).toHaveBeenCalled();
  });

  it("should call deleteUserByIdHandler on DELETE /user/:userId", async () => {
    await request(app).delete("/user/123");
    expect(handlers.deleteUserByIdHandler).toHaveBeenCalled();
  });
});
