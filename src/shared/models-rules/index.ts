import { Request } from 'express';

/**
 * @param {Request} request
 * @returns {string}
 */
export function getUserIdFromRequest(request: Request): string {
  return request.query.user_id as string;
}
