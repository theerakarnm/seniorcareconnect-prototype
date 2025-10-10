import { UserListQuery } from './user.interface';
import { userRepository } from './user.repository';

export class UserDomain {
  public async getUserById(id: string) {
    return userRepository.getUserById(id);
  }

  public async getUsers(query: UserListQuery) {
    return userRepository.getExample(query);
  }
}

// Export singleton instance
export const userDomain = new UserDomain();