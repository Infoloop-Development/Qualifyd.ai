export const logger = {
  info: (msg: unknown, ...rest: unknown[]) => console.log(msg, ...rest),
  warn: (msg: unknown, ...rest: unknown[]) => console.warn(msg, ...rest),
  error: (msg: unknown, ...rest: unknown[]) => console.error(msg, ...rest),
};

