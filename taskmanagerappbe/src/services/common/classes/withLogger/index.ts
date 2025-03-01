
import { LoggerType } from "../../../interface/loggertype";
import logger from "../logger"

class WithLogger {

    protected logger: LoggerType;

    constructor() {
        this.logger = logger
    }
}

export default WithLogger