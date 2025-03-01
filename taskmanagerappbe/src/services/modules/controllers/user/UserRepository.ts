import { ModifyUserInterface } from "../../../interface/modifyUserInterface"
import WithLogger from "../../../common/classes/withLogger"
import db from "../../../common/db"
import { createUserInterface } from "@root/src/services/interface/createUserInterface"
import convertToCamelCase from "../../../common/helperfunctions/convertToCamelCase"

class UserRepository extends WithLogger {

  private dbinstance

  constructor(dbinstance: typeof db) {
    super()
    this.dbinstance = dbinstance
  }

  async getUserById(uid: string) {
    try {
      const query = {
          text: 'SELECT u.id, u.email, u.password, u.first_name, u.last_name, r.name AS role FROM "user".users u JOIN "user".user_roles r ON u.role_id = r.id WHERE u.id = $1 LIMIT 1;',
          values: [uid],
      };

      const queryResult = await this.dbinstance.query(query.text, query.values);
      const result = queryResult.rows.length ? queryResult.rows[0] : null

      console.log(result)

      return [null, result]
    } catch (err) {
      return [err, null]
    }
  }

  async getUsers(limit: number, offset:number) {
    try {
      const usersQuery = {
        text: `SELECT id, email, first_name, last_name, role_id FROM "user".users ORDER BY created_at DESC LIMIT $1 OFFSET $2;`,
        values: [limit, offset],
      };

      const countQuery = {
        text: `SELECT COUNT(*) FROM "user".users;`,
        values: [],
      };

      const usersResult = await this.dbinstance.query(usersQuery.text, usersQuery.values);
      const countResult = await this.dbinstance.query(countQuery.text);

      return {
        users: convertToCamelCase(usersResult.rows),
        total: parseInt(countResult.rows[0].count, 10),
      };
    } catch (err) {
      console.log("err", err)
      return { users: [], total: 0 };
    }
  }

  async updateUser(uid: string, {firstName, lastName, email, password}: ModifyUserInterface) {
    try {
      const query = {
        text: `UPDATE "user".users 
          SET 
          first_name = COALESCE($2, first_name), 
          last_name = COALESCE($3, last_name), 
          email = COALESCE($4, email), 
          password = COALESCE($5, password)
          WHERE id = $1
          RETURNING id, email, first_name, last_name, role_id;`,
          values: [uid, firstName, lastName, email, password],
      };

      const queryResult = await this.dbinstance.query(query.text, query.values);
      const result = queryResult.rows.length ? queryResult.rows[0] : null

      return [null, result]
    } catch (err) {
      return [err, null]
    }
  }

  async deleteUser(uid: string){
    try {
      const query = {
        text: `DELETE FROM "user".users
          WHERE id = $1;`,
          values: [uid],
      };

      const queryResult = await this.dbinstance.query(query.text, query.values);
      const result = queryResult.rows.length ? queryResult.rows[0] : null

      return [null, result]
    } catch (err) {
      return [err, null]
    }
  }

  async createUser({firstName, lastName, email, password, roleId}:createUserInterface){
    try {
      const query = {
          text: 'INSERT INTO "user".users (email, password, first_name, last_name, role_id) VALUES ($1, $2, $3, $4, $5) RETURNING id, email',
          values: [email, password, firstName, lastName, roleId],
      };

      const queryResult = await this.dbinstance.query(query.text, query.values);
      const result = queryResult.rows.length ? queryResult.rows[0] : null
      
      return [null, result]
    } catch (err) {
      return [err, null]
    }
  }
}

export default UserRepository
