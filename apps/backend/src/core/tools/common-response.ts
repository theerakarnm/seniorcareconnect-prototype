import { Context } from 'hono';
import { ContentfulStatusCode } from 'hono/utils/http-status';

// Base response interface
export interface BaseResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: ErrorDetails;
  meta?: ResponseMeta;
  timestamp: string;
}

// Error details structure
export interface ErrorDetails {
  code: string;
  message: string;
  details?: Record<string, any>;
  field?: string;
  stack?: string; // Only in development
}

// Response metadata
export interface ResponseMeta {
  pagination?: PaginationMeta;
  total?: number;
  version?: string;
  requestId?: string;
}

// Pagination metadata
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Paginated data wrapper
export interface PaginatedData<T> {
  items: T[];
  pagination: PaginationMeta;
}

// HTTP status codes enum
export enum HttpStatus {
  OK = 200,
  CREATED = 201,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  UNPROCESSABLE_ENTITY = 422,
  INTERNAL_SERVER_ERROR = 500,
}

// Error codes for the quotation system
export enum ErrorCode {
  // General
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  INTERNAL_ERROR = 'INTERNAL_ERROR',

  // Authentication
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  TOKEN_INVALID = 'TOKEN_INVALID',

  // Client specific
  CLIENT_NOT_FOUND = 'CLIENT_NOT_FOUND',
  CLIENT_ALREADY_EXISTS = 'CLIENT_ALREADY_EXISTS',

  // Template specific
  TEMPLATE_NOT_FOUND = 'TEMPLATE_NOT_FOUND',
  TEMPLATE_INVALID = 'TEMPLATE_INVALID',
}

/**
 * Create a successful response
 */
export function createSuccessResponse<T>(
  data: T,
  message: string = 'Success',
  meta?: ResponseMeta
): BaseResponse<T> {
  return {
    success: true,
    message,
    data,
    meta,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Create a paginated success response
 */
export function createPaginatedResponse<T>(
  items: T[],
  pagination: PaginationMeta,
  message: string = 'Success'
): BaseResponse<PaginatedData<T>> {
  return createSuccessResponse(
    { items, pagination },
    message,
    { pagination, total: pagination.total }
  );
}

/**
 * Create an error response
 */
export function createErrorResponse(
  code: ErrorCode | string,
  message: string,
  details?: Record<string, any>,
  field?: string
): BaseResponse {
  const isDevelopment = process.env.NODE_ENV === 'development';

  return {
    success: false,
    message: 'Request failed',
    error: {
      code,
      message,
      details,
      field,
      ...(isDevelopment && details?.stack && { stack: details.stack }),
    },
    timestamp: new Date().toISOString(),
  };
}

/**
 * Send successful JSON response
 */
export function sendSuccess<T>(
  c: Context,
  data: T,
  message: string = 'Success',
  status: ContentfulStatusCode = HttpStatus.OK,
  meta?: ResponseMeta
) {
  return c.json(createSuccessResponse(data, message, meta), status);
}

/**
 * Send paginated JSON response
 */
export function sendPaginatedSuccess<T>(
  c: Context,
  items: T[],
  pagination: PaginationMeta,
  message: string = 'Success',
  status: ContentfulStatusCode = HttpStatus.OK
) {
  return c.json(createPaginatedResponse(items, pagination, message), status);
}

/**
 * Send error JSON response
 */
export function sendError(
  c: Context,
  code: ErrorCode | string,
  message: string,
  status: ContentfulStatusCode = HttpStatus.BAD_REQUEST,
  details?: Record<string, any>,
  field?: string
) {
  return c.json(createErrorResponse(code, message, details, field), status);
}

/**
 * Send validation error response
 */
export function sendValidationError(
  c: Context,
  message: string,
  details?: Record<string, any>,
  field?: string
) {
  return sendError(
    c,
    ErrorCode.VALIDATION_ERROR,
    message,
    HttpStatus.UNPROCESSABLE_ENTITY,
    details,
    field
  );
}

/**
 * Send not found error response
 */
export function sendNotFound(
  c: Context,
  resource: string = 'Resource'
) {
  return sendError(
    c,
    ErrorCode.NOT_FOUND,
    `${resource} not found`,
    HttpStatus.NOT_FOUND
  );
}

/**
 * Send unauthorized error response
 */
export function sendUnauthorized(
  c: Context,
  message: string = 'Unauthorized access'
) {
  return sendError(
    c,
    ErrorCode.UNAUTHORIZED,
    message,
    HttpStatus.UNAUTHORIZED
  );
}

/**
 * Send forbidden error response
 */
export function sendForbidden(
  c: Context,
  message: string = 'Access forbidden'
) {
  return sendError(
    c,
    ErrorCode.FORBIDDEN,
    message,
    HttpStatus.FORBIDDEN
  );
}

/**
 * Send internal server error response
 */
export function sendInternalError(
  c: Context,
  message: string = 'Internal server error',
  error?: Error
) {
  const details = error ? {
    name: error.name,
    message: error.message,
    stack: error.stack
  } : undefined;

  return sendError(
    c,
    ErrorCode.INTERNAL_ERROR,
    message,
    HttpStatus.INTERNAL_SERVER_ERROR,
    details
  );
}

/**
 * Calculate pagination metadata
 */
export function calculatePagination(
  page: number,
  limit: number,
  total: number
): PaginationMeta {
  const totalPages = Math.ceil(total / limit);

  return {
    page,
    limit,
    total,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  };
}

/**
 * Parse pagination parameters from query
 */
export function parsePaginationQuery(c: Context): { page: number; limit: number } {
  const page = Math.max(1, parseInt(c.req.query('page') || '1', 10));
  const limit = Math.min(100, Math.max(1, parseInt(c.req.query('limit') || '10', 10)));

  return { page, limit };
}

/**
 * Calculate offset for database queries
 */
export function calculateOffset(page: number, limit: number): number {
  return (page - 1) * limit;
}