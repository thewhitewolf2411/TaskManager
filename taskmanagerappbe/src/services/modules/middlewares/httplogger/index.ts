import morgan from "morgan";
import logger from "../../../common/classes/logger";
import { StreamOptions } from 'morgan';

// Extend the logger with Morgan-compatible stream
const stream: StreamOptions = {
  write: (message: string) => logger.info(message.trim()),
};

const httplogger = morgan('combined', { stream });

export default httplogger;
