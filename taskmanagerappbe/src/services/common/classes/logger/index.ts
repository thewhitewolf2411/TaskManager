import { createLogger, transports, format} from "winston"

const logger = createLogger({
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss:ms" }),
    format.metadata({ fillExcept: ["message", "level", "timestamp"] }),
    format.errors({ stack: true })
  ),
  transports: [
    new transports.Console({
      format: format.combine(format.json()),
    }),
  ],
})

export default logger
