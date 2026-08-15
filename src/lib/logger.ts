type LogLevel = "info" | "warn" | "error" | "debug";

interface LogMessage {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: Record<string, unknown>;
}

function serializeContext(context?: Record<string, unknown>): Record<string, unknown> | undefined {
  if (!context) return undefined;
  const serialized: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(context)) {
    if (value instanceof Error) {
      serialized[key] = {
        name: value.name,
        message: value.message,
        stack: value.stack,
      };
    } else {
      serialized[key] = value;
    }
  }
  return serialized;
}

function formatLog(level: LogLevel, message: string, context?: Record<string, unknown>): string {
  const payload: LogMessage = {
    timestamp: new Date().toISOString(),
    level,
    message,
    context: serializeContext(context),
  };
  return JSON.stringify(payload);
}

export const logger = {
  info(message: string, context?: Record<string, unknown>) {
    console.info(formatLog("info", message, context));
  },
  warn(message: string, context?: Record<string, unknown>) {
    console.warn(formatLog("warn", message, context));
  },
  error(message: string, context?: Record<string, unknown>) {
    console.error(formatLog("error", message, context));
  },
  debug(message: string, context?: Record<string, unknown>) {
    if (process.env.NODE_ENV !== "production") {
      console.debug(formatLog("debug", message, context));
    }
  },
};
