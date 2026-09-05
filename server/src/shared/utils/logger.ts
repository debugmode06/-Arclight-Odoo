import { env } from '../../config/env.config';

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

function formatMessage(level: LogLevel, context: string, message: string): string {
  const timestamp = new Date().toISOString();
  return `[${timestamp}] [${level.toUpperCase()}] [${context}] ${message}`;
}

export const logger = {
  info: (context: string, message: string, data?: unknown): void => {
    console.log(formatMessage('info', context, message), data !== undefined ? data : '');
  },
  warn: (context: string, message: string, data?: unknown): void => {
    console.warn(formatMessage('warn', context, message), data !== undefined ? data : '');
  },
  error: (context: string, message: string, error?: unknown): void => {
    console.error(formatMessage('error', context, message), error !== undefined ? error : '');
  },
  debug: (context: string, message: string, data?: unknown): void => {
    if (env.isDevelopment) {
      console.debug(formatMessage('debug', context, message), data !== undefined ? data : '');
    }
  },
};
