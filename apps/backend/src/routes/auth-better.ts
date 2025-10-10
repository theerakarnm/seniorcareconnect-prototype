// import { Hono } from 'hono';
// import { betterAuthHandler } from '../core/auth/handler';
// import { betterAuthMiddleware, requireRole } from '../middleware/better-auth.middleware';
// import { auth } from '../core/auth/better-auth.config';
// import { db } from '../core/database';
// import { user } from '../core/database/auth-schema';

// const authRoutes = new Hono();

// /**
//  * Better Auth handler - handles all authentication endpoints
//  * This includes:
//  * - POST /auth/sign-up
//  * - POST /auth/sign-in
//  * - POST /auth/sign-out
//  * - GET /auth/session
//  * - POST /auth/reset-password
//  * - etc.
//  */
// authRoutes.all('/auth/*', betterAuthHandler);

// /**
//  * GET /auth/me
//  * Get current user profile with role information
//  */
// authRoutes.get('/auth/me', betterAuthMiddleware, async (c) => {
//   const user = c.get('user');

//   return c.json({
//     success: true,
//     data: {
//       user: {
//         id: user.id,
//         email: user.email,
//         name: user.name,
//         role: user.role,
//         emailVerified: user.emailVerified,
//       },
//     },
//   });
// });

// /**
//  * POST /auth/change-role (admin only)
//  * Update user role - requires admin privileges
//  */
// authRoutes.post('/auth/change-role',
//   betterAuthMiddleware,
//   requireRole('admin'),
//   async (c) => {
//     try {
//       const { userId, newRole } = await c.req.json();

//       if (!userId || !newRole) {
//         return c.json({
//           success: false,
//           error: {
//             code: 'INVALID_INPUT',
//             message: 'userId and newRole are required',
//             timestamp: new Date().toISOString(),
//           },
//         }, 400);
//       }

//       if (!['user', 'admin', 'moderator'].includes(newRole)) {
//         return c.json({
//           success: false,
//           error: {
//             code: 'INVALID_ROLE',
//             message: 'Invalid role specified',
//             timestamp: new Date().toISOString(),
//           },
//         }, 400);
//       }

//       // Update user role using Better Auth's updateUser function
//       const updatedUser = await auth.api.updateUser({
//         body: {
//           userId,
//           data: {
//             role: newRole,
//           },
//         },
//       });

//       return c.json({
//         success: true,
//         data: {
//           user: updatedUser,
//         },
//       });
//     } catch (error) {
//       const message = error instanceof Error ? error.message : 'Failed to update user role';

//       return c.json({
//         success: false,
//         error: {
//           code: 'ROLE_UPDATE_FAILED',
//           message,
//           timestamp: new Date().toISOString(),
//         },
//       }, 400);
//     }
//   }
// );

// /**
//  * GET /auth/users (admin only)
//  * List all users - requires admin privileges
//  */
// authRoutes.get('/auth/users',
//   betterAuthMiddleware,
//   requireRole('admin'),
//   async (c) => {
//     try {
//       // This would need to be implemented using Drizzle directly
//       // since Better Auth doesn't provide a built-in list users endpoint
//       const users = await db.select().from(user).limit(50);

//       return c.json({
//         success: true,
//         data: {
//           users: users.map(u => ({
//             id: u.id,
//             email: u.email,
//             name: u.name,
//             role: u.role,
//             emailVerified: u.emailVerified,
//             createdAt: u.createdAt,
//             updatedAt: u.updatedAt,
//           })),
//         },
//       });
//     } catch (error) {
//       const message = error instanceof Error ? error.message : 'Failed to fetch users';

//       return c.json({
//         success: false,
//         error: {
//           code: 'USERS_FETCH_FAILED',
//           message,
//           timestamp: new Date().toISOString(),
//         },
//       }, 500);
//     }
//   }
// );

// export default authRoutes;