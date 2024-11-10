import winston from "winston";
import { LogstashTransport } from "winston-logstash-ts";

class Logger {
  private logger: winston.Logger;
  private context: string;

  constructor(context: string) {
    this.logger = LogstashTransport.createLogger(context, {
      host: `${process.env.LOGSTASH_HOST}`,
      port: Number(`${process.env.LOGSTASH_PORT}`),
      protocol: "tcp",
      format: winston.format.combine(winston.format.json()),
    });
    this.context = context;

    this.logger.on("data", (chunk) => console.log("chunk", chunk));
  }

  log(level: string, message: string, description: string) {
    this.logger.log(level, message, {
      app: "filesender",
      context: this.context,
      description,
    });
  }

  info(message: string, description: string) {
    this.log("info", message, description);
  }

  error(message: string, description: string) {
    this.log("error", message, description);
  }

  warn(message: string, description: string) {
    this.log("warn", message, description);
  }
}

export default Logger;
