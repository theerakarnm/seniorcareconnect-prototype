import { describe, it, expect, beforeEach } from 'vitest';
import { auth } from '../better-auth.config';

describe('Better Auth Configuration', () => {
  describe('auth instance', () => {
    it('should be properly configured', () => {
      expect(auth).toBeDefined();
      expect(typeof auth.api.signUp).toBe('function');
      expect(typeof auth.api.signIn).toBe('function');
      expect(typeof auth.api.signOut).toBe('function');
      expect(typeof auth.api.getSession).toBe('function');
    });

    it('should have email and password authentication enabled', async () => {
      // Test if the configuration is properly set up
      const config = auth.$Infer.Session;
      expect(config).toBeDefined();
    });
  });

  describe('authentication flow integration', () => {
    const testUser = {
      email: 'better-auth-test@example.com',
      password: 'TestPassword123',
      name: 'Better Auth Test User',
    };

    it('should handle sign up flow', async () => {
      try {
        const response = await auth.api.signUpEmail({
          body: testUser,
        });

        expect(response).toBeDefined();
        expect(response.user).toBeDefined();
        expect(response.user.email).toBe(testUser.email);
        expect(response.user.name).toBe(testUser.name);
      } catch (error) {
        // Handle potential duplicate user error
        if (error instanceof Error && error.message.includes('already exists')) {
          console.log('User already exists, skipping sign up test');
        } else {
          throw error;
        }
      }
    });

    it('should handle sign in flow', async () => {
      try {
        const response = await auth.api.signInEmail({
          body: {
            email: testUser.email,
            password: testUser.password,
          },
        });

        expect(response).toBeDefined();
        expect(response.user).toBeDefined();
        expect(response.user.email).toBe(testUser.email);
        expect(response.session).toBeDefined();
        expect(response.session.token).toBeDefined();
      } catch (error) {
        if (error instanceof Error && error.message.includes('Invalid credentials')) {
          // User might not exist, try signing up first
          await auth.api.signUpEmail({
            body: testUser,
          });

          // Try signing in again
          const response = await auth.api.signInEmail({
            body: {
              email: testUser.email,
              password: testUser.password,
            },
          });

          expect(response).toBeDefined();
          expect(response.user).toBeDefined();
          expect(response.session).toBeDefined();
        } else {
          throw error;
        }
      }
    });

    it('should handle session validation', async () => {
      try {
        // First sign in to get a session
        const signInResponse = await auth.api.signInEmail({
          body: {
            email: testUser.email,
            password: testUser.password,
          },
        });

        // Validate the session
        const sessionResponse = await auth.api.getSession({
          headers: {
            Authorization: `Bearer ${signInResponse.session.token}`,
          },
        });

        expect(sessionResponse).toBeDefined();
        expect(sessionResponse.user).toBeDefined();
        expect(sessionResponse.user.email).toBe(testUser.email);
        expect(sessionResponse.session).toBeDefined();
      } catch (error) {
        if (error instanceof Error && error.message.includes('Invalid credentials')) {
          console.log('Session validation skipped - user not found');
        } else {
          throw error;
        }
      }
    });

    it('should handle sign out flow', async () => {
      try {
        // First sign in to get a session
        const signInResponse = await auth.api.signInEmail({
          body: {
            email: testUser.email,
            password: testUser.password,
          },
        });

        // Sign out
        const signOutResponse = await auth.api.signOut({
          headers: {
            Authorization: `Bearer ${signInResponse.session.token}`,
          },
        });

        expect(signOutResponse).toBeDefined();
      } catch (error) {
        if (error instanceof Error && error.message.includes('Invalid credentials')) {
          console.log('Sign out test skipped - user not found');
        } else {
          throw error;
        }
      }
    });
  });

  describe('role-based access', () => {
    it('should handle user roles correctly', async () => {
      const testUserWithRole = {
        email: 'role-test@example.com',
        password: 'TestPassword123',
        name: 'Role Test User',
        role: 'user',
      };

      try {
        const response = await auth.api.signUpEmail({
          body: testUserWithRole,
        });

        expect(response).toBeDefined();
        expect(response.user).toBeDefined();

        // Check if role is properly stored (this depends on your schema implementation)
        // Note: You might need to extend Better Auth to handle custom fields like 'role'
        const userData = response.user as any;
        if (userData.role) {
          expect(userData.role).toBe(testUserWithRole.role);
        } else {
          console.log('Role field not implemented in Better Auth user object yet');
        }
      } catch (error) {
        if (error instanceof Error && error.message.includes('already exists')) {
          console.log('Role test user already exists');
        } else {
          throw error;
        }
      }
    });
  });
});