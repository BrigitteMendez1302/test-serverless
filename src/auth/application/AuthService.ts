import bcrypt from 'bcryptjs';
import { AuthRepository } from '../domain/repositories/AuthRepository';
import { JwtService } from '../infrastructure/integrations/JwtService';

export class AuthService {
  constructor(private readonly authRepository: AuthRepository) {}

  async signup(username: string, password: string): Promise<void> {
    const existingUser = await this.authRepository.findUserByUsername(username);
    if (existingUser) throw new Error('El usuario ya existe.');

    const hashedPassword = await bcrypt.hash(password, 10);
    await this.authRepository.createUser(username, hashedPassword);
  }

  async login(username: string, password: string): Promise<string> {
    const user = await this.authRepository.findUserByUsername(username);
    if (!user || !user.password) {
      throw new Error('Usuario no encontrado o contraseña no válida.');
    }
  
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new Error('Credenciales inválidas.');
    }
  
    return JwtService.generateToken({ username });
  }
  
}
