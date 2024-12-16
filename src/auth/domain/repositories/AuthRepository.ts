export interface AuthRepository {
    findUserByUsername(username: string): Promise<{ username?: string; password?: string } | null>;
    createUser(username: string, password: string): Promise<void>;
  }
  