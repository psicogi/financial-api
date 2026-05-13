import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsRepository } from './transactions.repository';
import { TransactionType } from './entities/transaction.entity';

const mockTransaction = {
  id: 'trans-uuid-1',
  description: 'Salário',
  amount: 5000,
  type: TransactionType.INCOME,
  category: 'Trabalho',
  userId: 'user-uuid-1',
  createdAt: new Date(),
};

const mockSummary = {
  totalIncome: 5000,
  totalExpense: 1500,
  balance: 3500,
};

describe('TransactionsService', () => {
  let service: TransactionsService;
  let repository: TransactionsRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionsService,
        {
          provide: TransactionsRepository,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            getSummary: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TransactionsService>(TransactionsService);
    repository = module.get<TransactionsRepository>(TransactionsRepository);
  });

  describe('create', () => {
    it('deve criar uma transação com sucesso', async () => {
      jest.spyOn(repository, 'create').mockResolvedValue(mockTransaction as any);

      const result = await service.create('user-uuid-1', {
        description: 'Salário',
        amount: 5000,
        type: TransactionType.INCOME,
      });

      expect(result).toEqual(mockTransaction);
      expect(repository.create).toHaveBeenCalledWith('user-uuid-1', expect.any(Object));
    });
  });

  describe('findAll', () => {
    it('deve retornar lista paginada de transações', async () => {
      const paginatedResult = {
        data: [mockTransaction],
        meta: { total: 1, page: 1, limit: 10, totalPages: 1 },
      };
      jest.spyOn(repository, 'findAll').mockResolvedValue(paginatedResult as any);

      const result = await service.findAll('user-uuid-1', { page: 1, limit: 10 });

      expect(result.data).toHaveLength(1);
      expect(result.meta.total).toBe(1);
    });
  });

  describe('findOne', () => {
    it('deve retornar uma transação pelo ID', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(mockTransaction as any);

      const result = await service.findOne('trans-uuid-1', 'user-uuid-1');
      expect(result).toEqual(mockTransaction);
    });

    it('deve lançar NotFoundException se não encontrar a transação', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.findOne('nao-existe', 'user-uuid-1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('deve remover a transação com sucesso', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(mockTransaction as any);
      jest.spyOn(repository, 'delete').mockResolvedValue(undefined);

      await expect(service.remove('trans-uuid-1', 'user-uuid-1')).resolves.not.toThrow();
    });
  });

  describe('getSummary', () => {
    it('deve retornar o resumo financeiro corretamente', async () => {
      jest.spyOn(repository, 'getSummary').mockResolvedValue(mockSummary);

      const result = await service.getSummary('user-uuid-1');

      expect(result.totalIncome).toBe(5000);
      expect(result.totalExpense).toBe(1500);
      expect(result.balance).toBe(3500);
    });
  });
});
