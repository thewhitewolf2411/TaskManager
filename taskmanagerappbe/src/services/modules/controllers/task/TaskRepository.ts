import { CreateTaskInterface } from "../../../interface/createTaskInterface";
import { ModifyTaskInterface } from "../../../interface/modifyTaskInterface";
import WithLogger from "../../../common/classes/withLogger";
import db from "../../../common/db";
import convertToCamelCase from "../../../common/helperfunctions/convertToCamelCase"

class TaskRepository extends WithLogger {
  private dbinstance;

  constructor(dbinstance: typeof db) {
    super();
    this.dbinstance = dbinstance;
  }

  async getTasks(priorityFilter: string | null, dueDateFilter: string | null) {
    try {
      const conditions = [];
      const values = [];

      if (priorityFilter) {
        conditions.push(`t.priority = $${values.length + 1}`);
        values.push(priorityFilter);
      }

      if (dueDateFilter) {
        conditions.push(`t.due_date::DATE = $${values.length + 1}::DATE`);
        values.push(dueDateFilter);
      }

      const whereClause = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

      const query = {
        text: `SELECT 
                  t.id, 
                  t.title, 
                  t.description, 
                  t.category_id, 
                  t.priority, 
                  t.status, 
                  t.user_id, 
                  t.due_date,
                  COALESCE(json_agg(
                    json_build_object(
                      'id', c.id,
                      'taskId', c.task_id,
                      'firstName', u.first_name,
                      'lastName', u.last_name,
                      'comment', c.comment,
                      'user_id', c.user_id,
                      'createdAt', c.created_at
                    )
                  ) FILTER (WHERE c.id IS NOT NULL), '[]') AS comments
                FROM task.task_list t
                LEFT JOIN task.comments c ON t.id = c.task_id
                LEFT JOIN "user".users u ON c.user_id = u.id
                ${whereClause}
                GROUP BY t.id;`,
        values,
      };

      const queryResult = await this.dbinstance.query(query.text, query.values);
      return [null, convertToCamelCase(queryResult.rows)];
    } catch (err) {
      return [err, null];
    }
  }


  async getTaskById(taskId: string) {
    try {
      const query = {
        text: `SELECT t.id, t.title, t.description, t.type, t.priority, t.due_date, t.created_by, 
                      u.email AS creator_email
               FROM task.task_list t
               JOIN "user".users u ON t.created_by = u.id
               WHERE t.id = $1 LIMIT 1;`,
        values: [taskId],
      };

      const queryResult = await this.dbinstance.query(query.text, query.values);
      const result = queryResult.rows.length ? queryResult.rows[0] : null;

      return [null, result];
    } catch (err) {
      return [err, null];
    }
  }

  async createTask(userId: string, { title, description, categoryId, priority, status, dueDate }: CreateTaskInterface) {
    try {
      const query = {
        text: `INSERT INTO task.task_list (title, description, category_id, priority, status, user_id, due_date)
               VALUES ($1, $2, $3, $4, $5, $6, $7) 
               RETURNING id, title, description, category_id, priority, status;`,
        values: [title, description, categoryId, priority, status, userId, dueDate],
      };

      const queryResult = await this.dbinstance.query(query.text, query.values);
      const result = queryResult.rows.length ? queryResult.rows[0] : null;

      return [null, convertToCamelCase(result)];
    } catch (err) {
      return [err, null];
    }
  }

  async updateTask(taskId: string, { title, description, status, priority }: ModifyTaskInterface) {
    try {
      const query = {
        text: `UPDATE task.task_list 
              SET 
                title = COALESCE($2, title), 
                description = COALESCE($3, description), 
                status = COALESCE($4, status), 
                priority = COALESCE($5, priority)
              WHERE id = $1
              RETURNING id, title, status, priority;`,  
        values: [taskId, title, description, status, priority],
      };

      const queryResult = await this.dbinstance.query(query.text, query.values);
      const result = queryResult.rows.length ? queryResult.rows[0] : null;

      return [null, convertToCamelCase(result)];
    } catch (err) {
      return [err, null];
    }
  }

  async updateTaskStatus(taskId: string, {status}: ModifyTaskInterface) {
      try {
        const query = {
          text: `UPDATE task.task_list 
                SET 
                  status = COALESCE($2, status)
                WHERE id = $1
                RETURNING *;`,
          values: [taskId, status],
        };

        const queryResult = await this.dbinstance.query(query.text, query.values);
        const result = queryResult.rows.length ? queryResult.rows[0] : null;

      return [null, convertToCamelCase(result)];
    } catch (err) {
      return [err, null];
    }
  }

  async deleteTask(taskId: string) {
    try {
      const query = {
        text: `DELETE FROM task.task_list WHERE id = $1 RETURNING id;`,
        values: [taskId],
      };

      const queryResult = await this.dbinstance.query(query.text, query.values);
      const result = queryResult.rows.length ? queryResult.rows[0] : null;

      return [null, convertToCamelCase(result)];
    } catch (err) {
      return [err, null];
    }
  }

  async changeTaskPriority(taskId: string, priority: string) {
    try {
      const query = {
        text: `UPDATE task.task_list 
               SET priority = $2
               WHERE id = $1
               RETURNING id, title, priority;`,
        values: [taskId, priority],
      };

      const queryResult = await this.dbinstance.query(query.text, query.values);
      const result = queryResult.rows.length ? queryResult.rows[0] : null;

      return [null, convertToCamelCase(result)];
    } catch (err) {
      return [err, null];
    }
  }

  async changeTaskType(taskId: string, type: string) {
    try {
      const query = {
        text: `UPDATE task.task_list 
               SET type = $2
               WHERE id = $1
               RETURNING id, title, type;`,
        values: [taskId, type],
      };

      const queryResult = await this.dbinstance.query(query.text, query.values);
      const result = queryResult.rows.length ? queryResult.rows[0] : null;

      return [null, convertToCamelCase(result)];
    } catch (err) {
      return [err, null];
    }
  }
  async addComment(taskId: string, userId: string, comment: string) {
    try {
      const query = {
        text: `INSERT INTO task.comments (task_id, user_id, comment)
              VALUES ($1, $2, $3) 
              RETURNING 
                  id, 
                  task_id, 
                  user_id, 
                  comment, 
                  created_at, 
                  (SELECT first_name FROM "user".users WHERE id = $2) AS first_name,
                  (SELECT last_name FROM "user".users WHERE id = $2) AS last_name;`,
        values: [taskId, userId, comment],
      };

      const queryResult = await this.dbinstance.query(query.text, query.values);
      const result = queryResult.rows.length ? queryResult.rows[0] : null;

      return [null, convertToCamelCase(result)];
    } catch (err) {
      return [err, null];
    }
  }

  async modifyComment(commentId: string, comment: string) {
    try {
      const query = {
        text: `UPDATE task.comments 
               SET comment = $2
               WHERE id = $1
               RETURNING id, comment, created_at;`,
        values: [commentId, comment],
      };

      const queryResult = await this.dbinstance.query(query.text, query.values);
      const result = queryResult.rows.length ? queryResult.rows[0] : null;

      return [null, convertToCamelCase(result)];
    } catch (err) {
      return [err, null];
    }
  }

  async deleteComment(commentId: string) {
    try {
      const query = {
        text: `DELETE FROM task.comments WHERE id = $1 RETURNING id;`,
        values: [commentId],
      };

      const queryResult = await this.dbinstance.query(query.text, query.values);
      const result = queryResult.rows.length ? queryResult.rows[0] : null;

      return [null, convertToCamelCase(result)];
    } catch (err) {
      return [err, null];
    }
  }
}

export default TaskRepository;
