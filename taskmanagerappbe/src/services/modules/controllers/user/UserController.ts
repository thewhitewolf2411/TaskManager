import { Request, Response, NextFunction } from 'express';

import bcrypt from "bcryptjs";
import Joi from "joi";

//import validation from "../../../common/validation"
import WithLogger from "../../../common/classes/withLogger"
import JWT from "../../../common/utils/jwt"
import AuthRepository from './UserRepository';
import ErrorClass from "../../../common/error/ErrorClasses"

const { ForbiddenError, NotFoundError, BadRequestError } = ErrorClass;

const jwt = new JWT()

const signJWT = (signData:string) => jwt.signKey(signData)

// Validation schemas
const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
});

const registerSchema = Joi.object({
    email: Joi.string().email().required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    password: Joi.string().min(6).required(),
});


class UserController extends WithLogger {
  
  private repo: AuthRepository;
  private bcrypt;

  constructor(repo: any, bcryptModule: typeof bcrypt) {
    super()
    this.repo = repo
    this.bcrypt = bcryptModule
  }

    // ✅ Validation Schemas
  private userUpdateSchema = Joi.object({
    firstName: Joi.string().min(2).max(50),
    lastName: Joi.string().min(2).max(50),
    email: Joi.string().email(),
    password: Joi.string().min(6),
  });

  private userIdParamSchema = Joi.object({
    userId: Joi.string().uuid().required(),
  });

  private createUserSchema = Joi.object({
    firstName: Joi.string().min(2).max(50).required(),
    lastName: Joi.string().min(2).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    roleId: Joi.number().integer().required(),
  });

  /**
   * @swagger
   * /users/me:
   *   get:
   *     summary: Get current logged-in user
   *     tags: [Users]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Successfully retrieved current user.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 id:
   *                   type: string
   *                 email:
   *                   type: string
   *                   format: email
   *                 firstName:
   *                   type: string
   *                 lastName:
   *                   type: string
   *                 role:
   *                   type: string
   *       403:
   *         description: Unauthorized, user not authenticated.
   *       404:
   *         description: User not found.
   *       500:
   *         description: Server error.
   */
  async getCurrentUserHandler(req: Request, res: Response) {
    try {
      const { user: reqUser } = req;

      if (!reqUser || !reqUser.id) throw new ForbiddenError();

      const { id: userId } = reqUser;
      
      const [, user] = await this.repo.getUserById(userId);
      if (!user) throw new NotFoundError();

      res.status(200).json(user);
    } catch (err) {
      throw new BadRequestError();
    }
  }

  /**
   * @swagger
   * /users/me:
   *   put:
   *     summary: Modify current logged-in user
   *     tags: [Users]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               email:
   *                 type: string
   *                 format: email
   *               firstName:
   *                 type: string
   *               lastName:
   *                 type: string
   *               password:
   *                 type: string
   *                 format: password
   *     responses:
   *       201:
   *         description: User modified successfully.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 user:
   *                   type: object
   *                   $ref: "#/components/schemas/User"
   *       400:
   *         description: Validation error.
   *       403:
   *         description: Unauthorized, user not authenticated.
   *       500:
   *         description: Server error.
   */
  async modifyCurrentUserHandler(req: Request, res: Response) {
    try {
      const { user: reqUser } = req;
      if (!reqUser || !reqUser.id) throw new ForbiddenError();

      const { error, value } = this.userUpdateSchema.validate(req.body);
      if (error) throw new BadRequestError();

      const { id: userId } = reqUser;

      if (value.password) {
        value.password = await bcrypt.hash(value.password, 10);
      }

      const [, updatedUser] = await this.repo.updateUser(userId, value);
      res.status(201).json({ user: updatedUser });
    } catch (err) {
      throw new BadRequestError();
    }
  }

  /**
   * @swagger
   * /users/me:
   *   delete:
   *     summary: Delete current logged-in user
   *     tags: [Users]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: User deleted successfully.
   *       403:
   *         description: Unauthorized, user not authenticated.
   *       500:
   *         description: Server error.
   */
  async deleteCurrentUserHandler(req: Request, res: Response) {
    try {
      const { user: reqUser } = req;
      if (!reqUser || !reqUser.id) throw new ForbiddenError();

      const { id: userId } = reqUser;

      this.repo.deleteUser(userId);
      res.status(200).json("OK");
    } catch (err) {
      throw new BadRequestError();
    }
  }

  /**
   * @swagger
   * /users:
   *   post:
   *     summary: Create a new user
   *     tags: [Users]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               email:
   *                 type: string
   *                 format: email
   *               firstName:
   *                 type: string
   *               lastName:
   *                 type: string
   *               password:
   *                 type: string
   *                 format: password
   *     responses:
   *       201:
   *         description: User created successfully.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 createdUser:
   *                   type: object
   *                   $ref: "#/components/schemas/User"
   *       400:
   *         description: Validation error.
   *       500:
   *         description: Server error.
   */
  async createUser(req: Request, res: Response) {
    try {
      const { error, value } = this.createUserSchema.validate(req.body);
      if (error) throw new BadRequestError();

      if (value.password) {
        value.password = await bcrypt.hash(value.password, 10);
      }

      const createdUser = await this.repo.createUser(value);
      res.status(201).json({ createdUser });
    } catch (err) {
      throw new BadRequestError();
    }
  }

  /**
   * @swagger
   * /users:
   *   get:
   *     summary: Get all users with pagination
   *     tags: [Users]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *         description: Page number (default is 1).
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *         description: Number of users per page (default is 10).
   *     responses:
   *       200:
   *         description: List of users retrieved successfully.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 page:
   *                   type: integer
   *                 limit:
   *                   type: integer
   *                 totalUsers:
   *                   type: integer
   *                 totalPages:
   *                   type: integer
   *                 users:
   *                   type: array
   *                   items:
   *                     $ref: "#/components/schemas/User"
   *       500:
   *         description: Server error.
   */
  async getAllUsers(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const offset = (page - 1) * limit;

      const { users, total } = await this.repo.getUsers(limit, offset);

      res.status(200).json({
        page,
        limit,
        totalUsers: total,
        totalPages: Math.ceil(total / limit),
        users,
      });
    } catch (err) {
      throw new BadRequestError();
    }
  }


  /**
   * @swagger
   * /users/{userId}:
   *   get:
   *     summary: Get user by ID
   *     tags: [Users]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: userId
   *         required: true
   *         schema:
   *           type: string
   *         description: The ID of the user to retrieve.
   *     responses:
   *       200:
   *         description: Successfully retrieved the user.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               $ref: "#/components/schemas/User"
   *       403:
   *         description: Unauthorized request.
   *       404:
   *         description: User not found.
   *       500:
   *         description: Server error.
   */
  async getUserByIdHandler(req: Request, res: Response) {
    try {
      const { userId } = req.params;

      if (!userId) throw new ForbiddenError();
      
      const [, user] = await this.repo.getUserById(userId);
      if (!user) throw new NotFoundError();

      res.status(200).json(user);
    } catch (err) {
      console.log(err);
      throw new BadRequestError();
    }
  }

  /**
   * @swagger
   * /users/{userId}:
   *   put:
   *     summary: Modify a user by ID
   *     tags: [Users]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: userId
   *         required: true
   *         schema:
   *           type: string
   *         description: The ID of the user to modify.
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               email:
   *                 type: string
   *                 format: email
   *               firstName:
   *                 type: string
   *               lastName:
   *                 type: string
   *               password:
   *                 type: string
   *                 format: password
   *     responses:
   *       201:
   *         description: User modified successfully.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 user:
   *                   type: object
   *                   $ref: "#/components/schemas/User"
   *       400:
   *         description: Validation error.
   *       403:
   *         description: Unauthorized request.
   *       500:
   *         description: Server error.
   */
  async modifyUserByIdHandler(req: Request, res: Response) {
    try {
      const { userId } = req.params;

      if (!userId) throw new ForbiddenError();

      const { error, value } = this.userUpdateSchema.validate(req.body);
      if (error) throw new BadRequestError();

      if (value.password) {
        value.password = await bcrypt.hash(value.password, 10);
      }

      const [, updatedUser] = await this.repo.updateUser(userId, value);
      res.status(201).json({ user: updatedUser });
    } catch (err) {
      throw new BadRequestError();
    }
  }

  /**
   * @swagger
   * /users/{userId}:
   *   delete:
   *     summary: Delete a user by ID
   *     tags: [Users]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: userId
   *         required: true
   *         schema:
   *           type: string
   *         description: The ID of the user to delete.
   *     responses:
   *       200:
   *         description: User deleted successfully.
   *       400:
   *         description: Cannot delete your own account.
   *       403:
   *         description: Unauthorized request.
   *       500:
   *         description: Server error.
   */
  async deleteUserByIdHandler(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      if (!userId) throw new ForbiddenError();

      const { user: reqUser } = req;
      if (reqUser?.id === userId) throw new BadRequestError();

      this.repo.deleteUser(userId);
      res.status(200).json("OK");
    } catch (err) {
      throw new BadRequestError();
    }
  }

}

export default UserController
