import { Request, Response, NextFunction } from 'express';
import bcrypt from "bcryptjs";
import Joi from "joi";
import WithLogger from "../../../common/classes/withLogger";
import JWT from "../../../common/utils/jwt";
import AuthRepository from './AuthRepository';

const jwt = new JWT();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication related endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     LoginRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: User's email
 *         password:
 *           type: string
 *           format: password
 *           description: User's password
 *     RegisterRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *         - firstName
 *         - lastName
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *         password:
 *           type: string
 *           format: password
 *           minLength: 6
 *         firstName:
 *           type: string
 *         lastName:
 *           type: string
 *     AuthResponse:
 *       type: object
 *       properties:
 *         token:
 *           type: string
 *         id:
 *           type: string
 *         email:
 *           type: string
 *         firstName:
 *           type: string
 *         lastName:
 *           type: string
 *         role:
 *           type: string
 */

class AuthController extends WithLogger {
  
  private repo: AuthRepository;
  private bcrypt;

  constructor(repo: any, bcryptModule: typeof bcrypt) {
    super();
    this.repo = repo;
    this.bcrypt = bcryptModule;
  }

  /**
   * @swagger
   * /auth/login:
   *   post:
   *     summary: User login
   *     tags: [Auth]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/LoginRequest'
   *     responses:
   *       200:
   *         description: Successfully logged in
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/AuthResponse'
   *       400:
   *         description: Validation error
   *       401:
   *         description: Invalid credentials
   */
  async loginHandler(req: Request, res: Response, next: NextFunction) {
    try {
        const { error, value } = Joi.object({
          email: Joi.string().email().required(),
          password: Joi.string().min(6).required()
        }).validate(req.body);

        if (error) return res.status(400).json({ error: error.details[0].message });

        const { email, password } = value;
        const user = await this.repo.getUserByEmail(email);
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        const token = jwt.signKey(user);

        const userData = {
          token,
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
        };

        res.json(userData);
    } catch (err) {
        console.log(err);
        next(err);
    }
  };

  /**
   * @swagger
   * /auth/register:
   *   post:
   *     summary: User registration
   *     tags: [Auth]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/RegisterRequest'
   *     responses:
   *       200:
   *         description: Successfully registered
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/AuthResponse'
   *       400:
   *         description: Validation error
   */
  async registerHandler(req: Request, res: Response, next: NextFunction){
    try {
        const { error, value } = Joi.object({
          email: Joi.string().email().required(),
          firstName: Joi.string().required(),
          lastName: Joi.string().required(),
          password: Joi.string().min(6).required()
        }).validate(req.body);

        if (error) return res.status(400).json({ error: error.details[0].message });

        const { email, password, firstName, lastName } = value;
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const user = await this.repo.registerUser(email, hashedPassword, firstName, lastName);
        
        const token = jwt.signKey(user);
        const userData = {
          token,
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
        };

        res.json(userData);
    } catch (err) {
        next(err);
    }
  };

  /**
   * @swagger
   * /auth/logout:
   *   post:
   *     summary: User logout
   *     tags: [Auth]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Successfully logged out
   *       401:
   *         description: Unauthorized
   */
  async logoutHandler(req: Request, res: Response) {
    const {
      headers: { authorization },
    } = req;

    if (authorization) {
      const { isValid, decoded } = jwt.verifyTokenFromRequest(authorization);

      res.status(200).send("ok");
    }
  }
}

export default AuthController;
