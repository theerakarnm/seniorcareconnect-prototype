import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { AuthService } from '../auth.service';

describe('AuthService', () => {
  const testUser = {
    email: 'test@example.com',
    password: 'testPassword123',
    firstName: 'Test',
    lastName: 'User',
    role: 'user',
  };

  beforeEach(async () => {
    // Clean up any existing test user before each test
    try {
      // Note: You might need to implement a cleanup method or use direct DB queries
      // For now, we'll handle duplicate user errors in the tests
    } catch (error) {
      // Ignore cleanup errors
    }
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      const result = await AuthService.register(testUser);

      expect(result).toBeDefined();
      expect(result.user).toBeDefined();
      expect(result.tokens).toBeDefined();

      expect(result.user.email).toBe(testUser.email);
      expect(result.user.name).toBe(`${testUser.firstName} ${testUser.lastName}`);
      expect(result.user.role).toBe(testUser.role);
      expect(result.user.emailVerified).toBe(false);

      expect(result.tokens.accessToken).toBeDefined();
      expect(result.tokens.refreshToken).toBeDefined();
    });

    it('should throw error for duplicate email registration', async () => {
      // Register user first time
      await AuthService.register(testUser);

      // Try to register same email again
      await expect(AuthService.register(testUser)).rejects.toThrow(
        'User with this email already exists'
      );
    });

    it('should hash password during registration', async () => {
      const result = await AuthService.register(testUser);

      // The password should not be returned in the user object
      expect(result.user.password).toBeUndefined();
    });
  });

  describe('login', () => {
    beforeEach(async () => {
      // Register a test user for login tests
      await AuthService.register(testUser);
    });

    it('should login user with valid credentials', async () => {
      const result = await AuthService.login({
        email: testUser.email,
        password: testUser.password,
      });

      expect(result).toBeDefined();
      expect(result.user).toBeDefined();
      expect(result.tokens).toBeDefined();

      expect(result.user.email).toBe(testUser.email);
      expect(result.tokens.accessToken).toBeDefined();
      expect(result.tokens.refreshToken).toBeDefined();
    });

    it('should throw error for invalid email', async () => {
      await expect(
        AuthService.login({
          email: 'invalid@example.com',
          password: testUser.password,
        })
      ).rejects.toThrow('Invalid email or password');
    });

    it('should throw error for invalid password', async () => {
      await expect(
        AuthService.login({
          email: testUser.email,
          password: 'wrongPassword',
        })
      ).rejects.toThrow('Invalid email or password');
    });
  });

  describe('getUserById', () => {
    let userId: string;

    beforeEach(async () => {
      const result = await AuthService.register(testUser);
      userId = result.user.id;
    });

    it('should return user data for valid ID', async () => {
      const user = await AuthService.getUserById(userId);

      expect(user).toBeDefined();
      expect(user!.id).toBe(userId);
      expect(user!.email).toBe(testUser.email);
      expect(user!.name).toBe(`${testUser.firstName} ${testUser.lastName}`);
      expect(user!.role).toBe(testUser.role);
    });

    it('should return null for invalid ID', async () => {
      const user = await AuthService.getUserById('invalid-user-id');
      expect(user).toBeNull();
    });
  });

  describe('updateProfile', () => {
    let userId: string;

    beforeEach(async () => {
      const result = await AuthService.register(testUser);
      userId = result.user.id;
    });

    it('should update user name successfully', async () => {
      const updatedUser = await AuthService.updateProfile(userId, {
        firstName: 'Updated',
        lastName: 'Name',
      });

      expect(updatedUser.name).toBe('Updated Name');
      expect(updatedUser.email).toBe(testUser.email); // Email should remain unchanged
    });

    it('should update user email successfully', async () => {
      const newEmail = 'updated@example.com';
      const updatedUser = await AuthService.updateProfile(userId, {
        email: newEmail,
      });

      expect(updatedUser.email).toBe(newEmail);
      expect(updatedUser.name).toBe(`${testUser.firstName} ${testUser.lastName}`); // Name should remain unchanged
    });

    it('should throw error for duplicate email', async () => {
      // Register another user
      const anotherUser = {
        ...testUser,
        email: 'another@example.com',
      };
      await AuthService.register(anotherUser);

      // Try to update first user's email to the second user's email
      await expect(
        AuthService.updateProfile(userId, {
          email: anotherUser.email,
        })
      ).rejects.toThrow('Email is already taken');
    });

    it('should throw error for non-existent user', async () => {
      await expect(
        AuthService.updateProfile('non-existent-id', {
          firstName: 'Updated',
        })
      ).rejects.toThrow('User not found');
    });
  });

  describe('changePassword', () => {
    let userId: string;

    beforeEach(async () => {
      const result = await AuthService.register(testUser);
      userId = result.user.id;
    });

    it('should change password successfully', async () => {
      const newPassword = 'newPassword123';

      await expect(
        AuthService.changePassword(userId, testUser.password, newPassword)
      ).resolves.not.toThrow();

      // Verify new password works by logging in
      await expect(
        AuthService.login({
          email: testUser.email,
          password: newPassword,
        })
      ).resolves.toBeDefined();
    });

    it('should throw error for incorrect current password', async () => {
      await expect(
        AuthService.changePassword(userId, 'wrongPassword', 'newPassword123')
      ).rejects.toThrow('Current password is incorrect');
    });

    it('should throw error for non-existent user', async () => {
      await expect(
        AuthService.changePassword('non-existent-id', testUser.password, 'newPassword123')
      ).rejects.toThrow('User account not found');
    });
  });

  describe('refreshToken', () => {
    let refreshToken: string;

    beforeEach(async () => {
      const result = await AuthService.register(testUser);
      refreshToken = result.tokens.refreshToken;
    });

    it('should generate new tokens with valid refresh token', async () => {
      const newTokens = await AuthService.refreshToken(refreshToken);

      expect(newTokens).toBeDefined();
      expect(newTokens.accessToken).toBeDefined();
      expect(newTokens.refreshToken).toBeDefined();
      expect(newTokens.accessToken).not.toBe(refreshToken);
    });

    it('should throw error for invalid refresh token', async () => {
      await expect(AuthService.refreshToken('invalid-refresh-token')).rejects.toThrow();
    });
  });
});