import { UserRepository } from '../repositories/UserRepository';
import { Role } from '../types/enums';
import type { User, CreateUser, UpdateUser } from '../types/User';
import { hashPassword, verifyPassword, generateToken } from '../utils/auth';

export class UserService {
  constructor(private userRepository: UserRepository) {}

  async create(data: CreateUser): Promise<User> {
    const hashedPassword = await hashPassword(data.password);
    return this.userRepository.create({ ...data, password: hashedPassword });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findByEmail(email);
  }

  async findById(id: number): Promise<User | null> {
    return this.userRepository.findById(id);
  }

  async login(email: string, password: string): Promise<{ user: User; token: string } | null> {
    const user = await this.findByEmail(email);
    if (!user || !(await verifyPassword(password, user.password))) {
      return null;
    }
    const token = generateToken({ id: user.id, email: user.email, role: user.role as Role });
    return { user, token };
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.findAll();
  }

  async update(id: number, data: UpdateUser): Promise<User> {
    return this.userRepository.update(id, data);
  }

  async delete(id: number): Promise<void> {
    return this.userRepository.delete(id);
  }
}
