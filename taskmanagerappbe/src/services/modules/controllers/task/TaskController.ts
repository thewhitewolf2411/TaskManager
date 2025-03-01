import { Request, Response, NextFunction } from "express";
import Joi from "joi";
import TaskRepository from "./TaskRepository";
import WithLogger from "../../../common/classes/withLogger";
import ErrorClass from "../../../common/error/ErrorClasses";

const { ForbiddenError, NotFoundError, BadRequestError, ServerError } = ErrorClass;

/**
 * @swagger
 * tags:
 *   name: Tasks
 *   description: Task management endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Task:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         categoryId:
 *           type: number
 *         priority:
 *           type: string
 *           enum: ["Low", "Medium", "High"]
 *         status:
 *           type: string
 *           enum: ["todo", "inProgress", "done"]
 *         dueDate:
 *           type: string
 *           format: date-time
 *     Comment:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         comment:
 *           type: string
 *         taskId:
 *           type: string
 *         userId:
 *           type: string
 */

class TaskController extends WithLogger {
  private repo: TaskRepository;

  constructor(repo: TaskRepository) {
    super();
    this.repo = repo;
  }

  private taskSchema = Joi.object({
    title: Joi.string().min(3).max(100),
    description: Joi.string().max(500),
    categoryId: Joi.number().valid(10, 20, 30),
    priority: Joi.string().valid("Low", "Medium", "High"),
    status: Joi.string().valid("todo", "inProgress", "done"),
    dueDate: Joi.date().valid()
  });

  private taskUpdateSchema = Joi.object({
    title: Joi.string().min(3).max(100),
    description: Joi.string().max(500),
    categoryId: Joi.number().valid(),
    priority: Joi.string().valid("Low", "Medium", "High"),
    status: Joi.string().valid("todo", "inProgress", "done"),
    dueDate: Joi.date().valid()
  });

  private taskIdParamSchema = Joi.object({
    taskId: Joi.string().uuid().required(),
  });

  private commentSchema = Joi.object({
    comment: Joi.string().min(1).max(300).required(),
  });

  private commentIdParamSchema = Joi.object({
    commentId: Joi.string().uuid().required(),
  });

  /**
   * @swagger
   * /tasks:
   *   get:
   *     summary: Retrieve a list of tasks
   *     tags: [Tasks]
   *     parameters:
   *       - in: query
   *         name: priority
   *         schema:
   *           type: string
   *           enum: ["Low", "Medium", "High", "all"]
   *         description: Filter tasks by priority (or use "all" for no filter).
   *       - in: query
   *         name: dueDate
   *         schema:
   *           type: string
   *           format: date
   *         description: Filter tasks by due date (format YYYY-MM-DD).
   *     responses:
   *       200:
   *         description: List of tasks retrieved successfully.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 tasks:
   *                   type: array
   *                   items:
   *                     $ref: "#/components/schemas/Task"
   *       500:
   *         description: Server error while fetching tasks.
   */
  async getTasks(req: Request, res: Response) {
    try {
      const { priority, dueDate } = req.query;

      const priorityParam = typeof priority === "string" && priority.toLowerCase() !== "all" ? priority : null;
      const dueDateParam = typeof dueDate === "string" && dueDate.toLowerCase() !== "all" ? dueDate : null;

      const [err, tasks] = await this.repo.getTasks(priorityParam, dueDateParam);

      if (err) {
        console.error("Error fetching tasks:", err);
        return res.status(500).json({ error: "Failed to fetch tasks" });
      }

      res.status(200).json({ tasks });
    } catch (err) {
      console.error("Error in getTasks:", err);
      throw new BadRequestError();
    }
  }

  /**
   * @swagger
   * /tasks:
   *   post:
   *     summary: Create a new task
   *     tags: [Tasks]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: "#/components/schemas/Task"
   *     responses:
   *       201:
   *         description: Task created successfully.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 createdTask:
   *                   $ref: "#/components/schemas/Task"
   *       400:
   *         description: Validation error.
   *       403:
   *         description: Unauthorized, user not authenticated.
   *       500:
   *         description: Server error.
   */
  async createTask(req: Request, res: Response) {
    try {
      const { user } = req;
      if (!user || !user.id) throw new ForbiddenError();

      const { error, value } = this.taskSchema.validate(req.body);
      if (error) throw new BadRequestError();

      const [err, createdTask] = await this.repo.createTask(user.id, value);
      if (err) throw new ServerError();

      res.status(201).json({ createdTask });
    } catch (err) {
      throw new BadRequestError();
    }
  }

  /**
   * @swagger
   * /tasks/{taskId}:
   *   put:
   *     summary: Update a task
   *     tags: [Tasks]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: taskId
   *         required: true
   *         schema:
   *           type: string
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: "#/components/schemas/Task"
   *     responses:
   *       200:
   *         description: Task updated successfully.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 updatedTask:
   *                   $ref: "#/components/schemas/Task"
   *       400:
   *         description: Validation error.
   *       403:
   *         description: Unauthorized, user not authenticated.
   *       404:
   *         description: Task not found.
   *       500:
   *         description: Server error.
   */
  async updateTask(req: Request, res: Response) {
    try {
      const { user } = req;
      if (!user || !user.id) throw new ForbiddenError();

      const { taskId } = req.params;
      const { error, value } = this.taskUpdateSchema.validate(req.body);
      if (error) throw new BadRequestError();

      const [err, updatedTask] = await this.repo.updateTask(taskId, value);
      if (err) throw new BadRequestError();

      res.status(200).json({ updatedTask });
    } catch (err) {
      throw new BadRequestError();
    }
  }

  /**
   * @swagger
   * /tasks/{taskId}/status:
   *   patch:
   *     summary: Update task status
   *     tags: [Tasks]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: taskId
   *         required: true
   *         schema:
   *           type: string
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               status:
   *                 type: string
   *                 enum: ["todo", "inProgress", "completed"]
   *     responses:
   *       200:
   *         description: Task status updated successfully.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 updatedTask:
   *                   $ref: "#/components/schemas/Task"
   *       400:
   *         description: Invalid status value.
   *       403:
   *         description: Unauthorized, user not authenticated.
   *       404:
   *         description: Task not found.
   *       500:
   *         description: Server error.
   */
  async updateTaskStatus(req: Request, res: Response) {
    try {
      const { user } = req;
      if (!user || !user.id) throw new ForbiddenError();

      const { taskId } = req.params;
      const { status } = req.body;

      const validStatuses = ["todo", "inProgress", "completed"];
      if (!validStatuses.includes(status)) {
        throw new BadRequestError("Invalid status value.");
      }

      const [err, updatedTask] = await this.repo.updateTaskStatus(taskId, { status });

      if (err) {
        console.log(err);
        throw new BadRequestError();
      }

      res.status(200).json({ updatedTask });
    } catch (err) {
      throw new BadRequestError();
    }
  }


  /**
   * @swagger
   * /tasks/{taskId}:
   *   delete:
   *     summary: Delete a task
   *     tags: [Tasks]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: taskId
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Task deleted successfully.
   *       403:
   *         description: Unauthorized, user not authenticated.
   *       404:
   *         description: Task not found.
   *       500:
   *         description: Server error.
   */
  async deleteTask(req: Request, res: Response) {
    try {
      const { user } = req;
      if (!user || !user.id) throw new ForbiddenError();

      const { taskId } = req.params;
      await this.repo.deleteTask(taskId);
      res.status(200).json("Task deleted successfully");
    } catch (err) {
      throw new BadRequestError();
    }
  }

  /**
   * @swagger
   * /tasks/{taskId}/priority:
   *   patch:
   *     summary: Change task priority
   *     tags: [Tasks]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: taskId
   *         required: true
   *         schema:
   *           type: string
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               priority:
   *                 type: string
   *                 enum: ["Low", "Medium", "High"]
   *     responses:
   *       200:
   *         description: Task priority updated successfully.
   *       400:
   *         description: Invalid priority value.
   *       403:
   *         description: Unauthorized, user not authenticated.
   *       500:
   *         description: Server error.
   */
  async changeTaskPriority(req: Request, res: Response) {
    try {
      const { taskId } = req.params;
      const { priority } = req.body;

      if (!["Low", "Medium", "High"].includes(priority)) {
        throw new BadRequestError();
      }

      const [, updatedTask] = await this.repo.updateTask(taskId, { priority });
      res.status(200).json({ updatedTask });
    } catch (err) {
      throw new BadRequestError();
    }
  }

  /**
   * @swagger
   * /tasks/{taskId}/comments:
   *   post:
   *     summary: Add a comment to a task
   *     tags: [Tasks]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: taskId
   *         required: true
   *         schema:
   *           type: string
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               comment:
   *                 type: string
   *     responses:
   *       201:
   *         description: Comment added successfully.
   *       400:
   *         description: Invalid request data.
   *       403:
   *         description: Unauthorized, user not authenticated.
   *       500:
   *         description: Server error.
   */
  async addComment(req: Request, res: Response) {
    try {
      const { user } = req;
      if (!user || !user.id) throw new ForbiddenError();

      const { taskId } = req.params;
      const { error, value } = this.commentSchema.validate(req.body);
      if (error) throw new BadRequestError();

      const [, createdComment] = await this.repo.addComment(taskId, user.id, value.comment);
      res.status(201).json(createdComment);
    } catch (err) {
      throw new BadRequestError();
    }
  }

  /**
   * @swagger
   * /comments/{commentId}:
   *   put:
   *     summary: Modify a comment
   *     tags: [Tasks]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: commentId
   *         required: true
   *         schema:
   *           type: string
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               comment:
   *                 type: string
   *     responses:
   *       200:
   *         description: Comment updated successfully.
   *       400:
   *         description: Invalid request data.
   *       403:
   *         description: Unauthorized, user not authenticated.
   *       500:
   *         description: Server error.
   */
  async modifyComment(req: Request, res: Response) {
    try {
      const { user } = req;
      if (!user || !user.id) throw new ForbiddenError();

      const { commentId } = req.params;
      const { error, value } = this.commentSchema.validate(req.body);
      if (error) throw new BadRequestError();

      const [, updatedComment] = await this.repo.modifyComment(commentId, value.comment);
      res.status(200).json({ updatedComment });
    } catch (err) {
      throw new BadRequestError();
    }
  }

  /**
   * @swagger
   * /comments/{commentId}:
   *   delete:
   *     summary: Delete a comment
   *     tags: [Tasks]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: commentId
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Comment deleted successfully.
   *       403:
   *         description: Unauthorized, user not authenticated.
   *       404:
   *         description: Comment not found.
   *       500:
   *         description: Server error.
   */
  async deleteComment(req: Request, res: Response) {
    try {
      const { user } = req;
      if (!user || !user.id) throw new ForbiddenError();

      const { commentId } = req.params;
      await this.repo.deleteComment(commentId);
      res.status(200).json("Comment deleted successfully");
    } catch (err) {
      throw new BadRequestError();
    }
  }
}

export default TaskController;
