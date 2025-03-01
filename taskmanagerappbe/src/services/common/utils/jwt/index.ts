import jwt from "jsonwebtoken"
import config from "../../../../config"
import JwtPayload from "../../../interface/decoded"
import WithLogger from "../../classes/withLogger"

const { jwtSecret, jwtIssuer, jwtAudience } = config

// Possible to initialize class with issuer and audience
// for convenience it has default values read from a config file
class JWT extends WithLogger {

  protected issuer;
  protected audience;
  protected verifyOptions;
  protected verifyAdminOptions;

  constructor({ issuer = jwtIssuer, audience = jwtAudience } = {}) {
    super()
    this.issuer = issuer
    this.audience = audience

    this.verifyOptions = {
      issuer,
      audience,
      expiresIn: "12h",
      algorithm: ["HS256"],
    }
    this.verifyAdminOptions = {
      issuer,
      audience,
      expiresIn: "9999 years",
      algorithm: ["HS256"],
    }
  }

  signKey(payload: string) {
    const signingOptions: any = {
      issuer: this.issuer,
      audience: this.audience,
      expiresIn: "12h",
      algorithm: "HS256",
    }

    try {
      return jwt.sign({ data: payload }, jwtSecret, signingOptions)
    } catch (e) {
      throw { status: 500, error: e }
    }
  }

  verifyTokenFromRequest(authToken: string, isAdmin?: boolean) {
    try {
      if (!authToken) {
        throw { status: 422, error: "No Authorization header set!" }
      }
      const token = authToken.split(" ").pop() || ""

      const decoded = jwt.verify(token, jwtSecret, this.verifyOptions) as JwtPayload

      if (isAdmin) return { isValid: decoded.data.role === "admin", decoded }
      return { isValid: true, decoded }
    } catch (e) {
      return { isValid: false }
    }
  }
}

export default JWT
