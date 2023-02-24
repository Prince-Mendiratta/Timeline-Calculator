import { appendFileSync } from "fs";
import { Logger } from "tslog";

const logger = new Logger({ 
    type: "pretty",
    minLevel: (process.env.DEBUG === 'true' ? 2 : 3)
});
logger.attachTransport((logObj) => {
    appendFileSync("logs.txt", JSON.stringify(logObj, (_, v) => typeof v === 'bigint' ? v.toString() : v) + "\n");
});

export default logger;