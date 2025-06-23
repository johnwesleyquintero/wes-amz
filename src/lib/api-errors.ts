/**
 * Base class for API-related errors.
 * Provides a consistent structure for errors originating from API interactions.
 */
export class ApiError extends Error {
  readonly statusCode?: number;
  readonly errorType?: string;
  readonly details?: unknown; // Flexible for additional error details

  constructor(
    message: string,
    statusCode?: number,
    errorType?: string,
    details?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.errorType = errorType;
    this.details = details;
  }
}

/**
 * Specific API error for network issues.
 */
export class NetworkError extends ApiError {
  constructor(message: string, details?: unknown) {
    super(message, undefined, "NETWORK_ERROR", details);
    this.name = "NetworkError";
  }
}

/**
 * Specific API error for client-side issues (e.g., bad request).
 */
export class ClientError extends ApiError {
  constructor(message: string, statusCode: number, details?: unknown) {
    super(message, statusCode, "CLIENT_ERROR", details);
    this.name = "ClientError";
  }
}

/**
 * Specific API error for server-side issues.
 */
export class ServerError extends ApiError {
  constructor(message: string, statusCode: number, details?: unknown) {
    super(message, statusCode, "SERVER_ERROR", details);
    this.name = "ServerError";
  }
}

/**
 * Specific API error for authentication issues.
 */
export class AuthenticationError extends ApiError {
  constructor(message: string, statusCode?: number, details?: unknown) {
    super(message, statusCode, "AUTHENTICATION_ERROR", details);
    this.name = "AuthenticationError";
  }
}

/**
 * Specific API error for authorization issues.
 */
export class AuthorizationError extends ApiError {
  constructor(message: string, statusCode?: number, details?: unknown) {
    super(message, statusCode, "AUTHORIZATION_ERROR", details);
    this.name = "AuthorizationError";
  }
}
