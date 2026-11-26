import type { Access } from 'payload'

/** Any logged-in admin user. Only the 2 site managers have accounts. */
export const authenticated: Access = ({ req: { user } }) => Boolean(user)

/** Public read. */
export const anyone: Access = () => true

/** Nobody through the API — server code writes with overrideAccess. */
export const nobody: Access = () => false
