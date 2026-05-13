import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersRepository } from './users.repository';

const mockUser = {
  id: 'uuid-123',
  name: 'João Silva',
  email: 'joao@email.com',
  password: 'hashed_password',
  createdAt: new Date(),
};

describe('UsersService', () => {
  let service: UsersService;
  let repository: UsersRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: UsersRepository,
          useValue: {
            create: jest.fn(),
            findByEmail: jest.fn(),
            findById: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<UsersRepository>(UsersRepository);
  });

  describe('create', () => {
    it('deve criar um novo usuário com sucesso', async () => {
      jest.spyOn(repository, 'findByEmail').mockResolvedValue(null);
      jest.spyOn(repository, 'create').mockResolvedValue(mockUser as any);

      const result = await service.create({
        name: 'João Silva',
        email: 'joao@email.com',
        password: 'Senha@123',
      });

      expect(result).toEqual(mockUser);
    });

    it('deve lançar ConflictException se e-mail já existir', async () => {
      jest.spyOn(repository, 'findByEmail').mockResolvedValue(mockUser as any);

      await expect(
        service.create({
          name: 'João',
          email: 'joao@email.com',
          password: '123456',
        }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('findById', () => {
    it('deve retornar usuário pelo ID', async () => {
      jest.spyOn(repository, 'findById').mockResolvedValue(mockUser as any);
      const result = await service.findById('uuid-123');
      expect(result).toEqual(mockUser);
    });

    it('deve lançar NotFoundException se usuário não existir', async () => {
      jest.spyOn(repository, 'findById').mockResolvedValue(null);
      await expect(service.findById('nao-existe')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('deve atualizar o usuário com sucesso', async () => {
      const updated = { ...mockUser, name: 'Novo Nome' };
      jest.spyOn(repository, 'findById').mockResolvedValue(mockUser as any);
      jest.spyOn(repository, 'findByEmail').mockResolvedValue(null);
      jest.spyOn(repository, 'update').mockResolvedValue(updated as any);

      const result = await service.update('uuid-123', { name: 'Novo Nome' });
      expect(result.name).toBe('Novo Nome');
    });
  });

  describe('remove', () => {
    it('deve remover o usuário com sucesso', async () => {
      jest.spyOn(repository, 'findById').mockResolvedValue(mockUser as any);
      jest.spyOn(repository, 'delete').mockResolvedValue(undefined);

      await expect(service.remove('uuid-123')).resolves.not.toThrow();
    });
  });
});
