export function createError(message, statusCode = 400) {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
}


export function logDebug(label, data) {
  if (process.env.DEBUG === 'true') {
    console.log(`${label}:`, data);
  }
}


export function throwIf(condition, message, statusCode = 400) {
  if (condition) {
    const error = new Error(message);
    error.statusCode = statusCode;
    throw error;
  }
}

export function throwError(message, statusCode) {
  const error = new Error(message);
  error.statusCode = statusCode;
  throw error;
}

