import convertToCamelCase from "../../../common/helperfunctions/convertToCamelCase"
import WithLogger from "../../../common/classes/withLogger"
import db from "../../../common/db"

class AuthRepository extends WithLogger {

  private dbinstance

  constructor(dbinstance: typeof db) {
    super()
    this.dbinstance = dbinstance
  }

  async getUserByEmail(email: string) {
    const query = {
        text: 'SELECT u.id, u.email, u.password, u.first_name, u.last_name, r.name AS role FROM "user".users u JOIN "user".user_roles r ON u.role_id = r.id WHERE u.email = $1 LIMIT 1;',
        values: [email],
    };

    const result = await this.dbinstance.query(query.text, query.values);
    return result.rows.length ? convertToCamelCase(result.rows[0]) : null;
  }

  async registerUser(email: string, hashedPassword: string, firstName: string, lastName: string) {
    const query = {
        text: 'INSERT INTO "user".users (email, password, first_name, last_name) VALUES ($1, $2, $3, $4) RETURNING id, email, first_name, last_name',
        values: [email, hashedPassword, firstName, lastName],
    };

    const result = await this.dbinstance.query(query.text, query.values);
    return result.rows.length ? convertToCamelCase(result.rows[0]) : null;
  }

  async logoutUser(token: string, decoded:any) {
    const query = {
      text: 'INSERT INTO "user".blacklisted_tokens(token, expires) VALUES($1, to_timestamp($2))',
      values: [token, decoded.exp],
    }

    await this.dbinstance.query(query.text, query.values)
    return true
  }

  async logUserLogin(userId:string, timeZone:string) {
    const query = {
      text: "INSERT INTO log.login (user_id, time_zone) VALUES($1, $2)",
      values: [userId, timeZone || ""],
    }

    await this.dbinstance.query(query.text, query.values)
    return true
  }
}

export default AuthRepository
