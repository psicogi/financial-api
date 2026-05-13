import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction, TransactionType } from './entities/transaction.entity';
import { CreateTransactionDto, TransactionFilterDto, UpdateTransactionDto } from './dto/transaction.dto';

export interface PaginatedResult<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface FinancialSummary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
}

@Injectable()
export class TransactionsRepository {
  constructor(
    @InjectRepository(Transaction)
    private readonly repo: Repository<Transaction>,
  ) {}

  async create(userId: string, dto: CreateTransactionDto): Promise<Transaction> {
    const transaction = this.repo.create({ ...dto, userId });
    return this.repo.save(transaction);
  }

  async findAll(
    userId: string,
    filters: TransactionFilterDto,
  ): Promise<PaginatedResult<Transaction>> {
    const { page = 1, limit = 10, type, category, startDate, endDate } = filters;

    const qb = this.repo
      .createQueryBuilder('t')
      .where('t.user_id = :userId', { userId })
      .orderBy('t.transaction_date', 'DESC')
      .addOrderBy('t.created_at', 'DESC');

    if (type) {
      qb.andWhere('t.type = :type', { type });
    }
    if (category) {
      qb.andWhere('LOWER(t.category) LIKE LOWER(:category)', { category: `%${category}%` });
    }
    if (startDate) {
      qb.andWhere('t.transaction_date >= :startDate', { startDate });
    }
    if (endDate) {
      qb.andWhere('t.transaction_date <= :endDate', { endDate });
    }

    const total = await qb.getCount();
    const data = await qb
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string, userId: string): Promise<Transaction | null> {
    return this.repo.findOne({ where: { id, userId } });
  }

  async update(id: string, dto: UpdateTransactionDto): Promise<Transaction> {
    await this.repo.update(id, dto);
    return this.repo.findOne({ where: { id } });
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id);
  }

  async getSummary(userId: string): Promise<FinancialSummary> {
    const result = await this.repo
      .createQueryBuilder('t')
      .select([
        `COALESCE(SUM(CASE WHEN t.type = '${TransactionType.INCOME}' THEN t.amount ELSE 0 END), 0) AS "totalIncome"`,
        `COALESCE(SUM(CASE WHEN t.type = '${TransactionType.EXPENSE}' THEN t.amount ELSE 0 END), 0) AS "totalExpense"`,
      ])
      .where('t.user_id = :userId', { userId })
      .getRawOne();

    const totalIncome = parseFloat(result.totalIncome);
    const totalExpense = parseFloat(result.totalExpense);

    return {
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
    };
  }
}
