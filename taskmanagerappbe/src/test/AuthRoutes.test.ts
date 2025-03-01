import request from "supertest";
import express, { Router, Application } from "express";
import AuthRoutes from "../services/modules/controllers/auth/AuthRoutes";

describe("AuthRoutes", () => {
  let app: Application;
  let handlers: any;

  beforeEach(() => {
    handlers = {
      loginHandler: jest.fn().mockResolvedValue({}),
      registerHandler: jest.fn().mockResolvedValue({}),
      logoutHandler: jest.fn().mockResolvedValue({}),
    };

    const router = Router();
    const protectedRouter = Router();
    const adminRouter = Router();

    new AuthRoutes(router, protectedRouter, adminRouter, handlers);

    app = express();
    app.use(express.json());
    app.use("/", router);
    app.use("/", protectedRouter);
    app.use("/", adminRouter);
  });

  it("should call loginHandler on POST /auth/login", async () => {
    await request(app).post("/auth/login").send({ email: "user@example.com", password: "password" });
    expect(handlers.loginHandler).toHaveBeenCalled();
  });

  it("should call registerHandler on POST /auth/register", async () => {
    await request(app).post("/auth/register").send({ email: "user@example.com", password: "password" });
    expect(handlers.registerHandler).toHaveBeenCalled();
  });

  it("should call logoutHandler on GET /auth/logout", async () => {
    await request(app).get("/auth/logout");
    expect(handlers.logoutHandler).toHaveBeenCalled();
  });
});
