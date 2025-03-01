

import express, { Application } from 'express';
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import bodyParser from 'body-parser';
import cors, { CorsOptions } from 'cors';
import bcrypt from "bcryptjs";

import config from "./config"
import authorizationMiddleware from './services/modules/middlewares/authorisation';
import logger from "./services/common/classes/logger"
import db from "./services/common/db"
import errorHandling from './services/common/error';
import classRegistry from './services/common/classes/classRegistry';

import AuthModule from './services/modules/controllers/auth';
import UserModule from './services/modules/controllers/user';
import httplogger from './services/modules/middlewares/httplogger';
import TaskModule from './services/modules/controllers/task';

const app: Application = express();

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Auth API",
    version: "1.0.0",
    description: "API for user authentication",
  },
  servers: [{ url: "http://localhost:5000" }],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
};

const swaggerOptions = {
  swaggerDefinition,
  apis: ["./src/services/modules/controllers/auth/AuthController.ts", "./src/services/modules/controllers/task/TaskController.ts", "./src/services/modules/controllers/user/UserController.ts"],
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

const corsOptions: CorsOptions = {
  origin: (origin, callback) => callback(null, true), 
  credentials: true,
};
app.use(httplogger)
app.use(cors(corsOptions))
app.options("*", cors(corsOptions))
app.use(bodyParser.json())

const router = express.Router()
const protectedRouter = express.Router()
const adminRouter = express.Router()

protectedRouter.use(authorizationMiddleware())
adminRouter.use(authorizationMiddleware(true))

const Auth = new AuthModule(router, protectedRouter, adminRouter, db, bcrypt)
const User = new UserModule(router, protectedRouter, adminRouter, db, bcrypt)
const Task = new TaskModule(router, protectedRouter, adminRouter, db)

classRegistry.register("User", User)
classRegistry.register("Auth", Auth)
classRegistry.register("Task", Task)

app.use("/", router)
app.use("/", protectedRouter)
app.use("/admin", adminRouter)

app.use(errorHandling)

app.listen(config.port, () => logger.info(`Service is listening on port: ${config.port}`))