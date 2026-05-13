import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/user.dto';
import { LoginDto } from './dto/login.dto';

const mockUser = {
  id: 'uuid-123',
  name: 'João Silva',
  email: 'joao@email.com',
  password: 'hashed_password',
  createdAt: new Date(),
  updatedAt: new Date(),
  validatePassword: jest.fn(),
};

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            create: jest.fn(),
            findByEmail: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('mock_jwt_token'),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('register', () => {
    it('deve cadastrar um novo usuário e retornar token', async () => {
      const dto: CreateUserDto = {
        name: 'João Silva',
        email: 'joao@email.com',
        password: 'Senha@123',
      };

      jest.spyOn(usersService, 'create').mockResolvedValue(mockUser as any);

      const result = await service.register(dto);

      expect(usersService.create).toHaveBeenCalledWith(dto);
      expect(result).toHaveProperty('accessToken', 'mock_jwt_token');
      expect(result.user).toMatchObject({
        id: mockUser.id,
        name: mockUser.name,
        email: mockUser.email,
      });
    });
  });

  describe('login', () => {
    it('deve autenticar com credenciais corretas e retornar token', async () => {
      const dto: LoginDto = {
        email: 'joao@email.com',
        password: 'Senha@123',
      };

      mockUser.validatePassword.mockResolvedValue(true);
      jest.spyOn(usersService, 'findByEmail').mockResolvedValue(mockUser as any);

      const result = await service.login(dto);

      expect(result).toHaveProperty('accessToken', 'mock_jwt_token');
      expect(result.user.email).toBe(dto.email);
    });

    it('deve lançar UnauthorizedException com e-mail inexistente', async () => {
      jest.spyOn(usersService, 'findByEmail').mockResolvedValue(null);

      await expect(
        service.login({ email: 'nao@existe.com', password: '123456' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('deve lançar UnauthorizedException com senha errada', async () => {
      mockUser.validatePassword.mockResolvedValue(false);
      jest.spyOn(usersService, 'findByEmail').mockResolvedValue(mockUser as any);

      await expect(
        service.login({ email: 'joao@email.com', password: 'senha_errada' }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
