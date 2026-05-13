import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, IsDateString, MaxLength, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { TransactionType } from '../entities/transaction.entity';

export class CreateTransactionDto {
  @IsString()
  @IsNotEmpty({ message: 'Descrição é obrigatória' })
  @MaxLength(200)
  description: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01, { message: 'Valor deve ser maior que zero' })
  amount: number;

  @IsEnum(TransactionType, { message: 'Tipo deve ser "income" ou "expense"' })
  type: TransactionType;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  category?: string;

  @IsOptional()
  @IsDateString({}, { message: 'Data inválida. Use o formato YYYY-MM-DD' })
  transactionDate?: string;
}

export class UpdateTransactionDto {
  @IsOptional() @IsString() @MaxLength(200)
  description?: string;

  @IsOptional() @IsNumber({ maxDecimalPlaces: 2 }) @Min(0.01)
  amount?: number;

  @IsOptional() @IsEnum(TransactionType)
  type?: TransactionType;

  @IsOptional() @IsString() @MaxLength(100)
  category?: string;

  @IsOptional() @IsDateString()
  transactionDate?: string;
}

export class TransactionFilterDto {
  @IsOptional() @Type(() => Number) @IsNumber() @Min(1)
  page?: number = 1;

  @IsOptional() @Type(() => Number) @IsNumber() @Min(1)
  limit?: number = 10;

  @IsOptional() @IsEnum(TransactionType)
  type?: TransactionType;

  @IsOptional() @IsString()
  category?: string;

  @IsOptional() @IsDateString()
  startDate?: string;

  @IsOptional() @IsDateString()
  endDate?: string;
}