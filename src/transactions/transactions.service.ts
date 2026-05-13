import { Injectable, NotFoundException } from '@nestjs/common';
import { TransactionsRepository } from './transactions.repository';
import { CreateTransactionDto, TransactionFilterDto, UpdateTransactionDto } from './dto/transaction.dto';

@Injectable()
export class TransactionsService {
  constructor(private readonly transactionsRepository: TransactionsRepository) {}

  async create(userId: string, dto: CreateTransactionDto) {
    return this.transactionsRepository.create(userId, dto);
  }

  async findAll(userId: string, filters: TransactionFilterDto) {
    return this.transactionsRepository.findAll(userId, filters);
  }

  async findOne(id: string, userId: string) {
    const transaction = await this.transactionsRepository.findOne(id, userId);
    if (!transaction) {
      throw new NotFoundException('Transação não encontrada');
    }
    return transaction;
  }

  async update(id: string, userId: string, dto: UpdateTransactionDto) {
    await this.findOne(id, userId);
    return this.transactionsRepository.update(id, dto);
  }

  async remove(id: string, userId: string) {
    await this.findOne(id, userId);
    await this.transactionsRepository.delete(id);
  }

  async getSummary(userId: string) {
    return this.transactionsRepository.getSummary(userId);
  }
}
