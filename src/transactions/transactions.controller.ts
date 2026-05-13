import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { TransactionsService } from './transactions.service';
import {
  CreateTransactionDto,
  TransactionFilterDto,
  UpdateTransactionDto,
} from './dto/transaction.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';

@ApiTags('Transactions')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  @ApiOperation({ summary: 'Cria uma nova transação' })
  @ApiResponse({ status: 201, description: 'Transação criada com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  async create(
    @CurrentUser() user: User,
    @Body() dto: CreateTransactionDto,
  ) {
    return this.transactionsService.create(user.id, dto);
  }

  @Get()
  @ApiOperation({
    summary: 'Lista todas as transações do usuário com paginação e filtros',
  })
  @ApiResponse({ status: 200, description: 'Lista de transações paginada' })
  async findAll(
    @CurrentUser() user: User,
    @Query() filters: TransactionFilterDto,
  ) {
    return this.transactionsService.findAll(user.id, filters);
  }

  @Get('summary')
  @ApiOperation({ summary: 'Retorna o resumo financeiro do usuário' })
  @ApiResponse({
    status: 200,
    description: 'Resumo com total de entradas, saídas e saldo final',
    schema: {
      example: {
        totalIncome: 5000.0,
        totalExpense: 2350.75,
        balance: 2649.25,
      },
    },
  })
  async getSummary(@CurrentUser() user: User) {
    return this.transactionsService.getSummary(user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Busca uma transação pelo ID' })
  @ApiParam({ name: 'id', description: 'UUID da transação' })
  @ApiResponse({ status: 200, description: 'Transação encontrada' })
  @ApiResponse({ status: 404, description: 'Transação não encontrada' })
  async findOne(
    @CurrentUser() user: User,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.transactionsService.findOne(id, user.id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualiza uma transação pelo ID' })
  @ApiParam({ name: 'id', description: 'UUID da transação' })
  @ApiResponse({ status: 200, description: 'Transação atualizada com sucesso' })
  @ApiResponse({ status: 404, description: 'Transação não encontrada' })
  async update(
    @CurrentUser() user: User,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateTransactionDto,
  ) {
    return this.transactionsService.update(id, user.id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove uma transação pelo ID' })
  @ApiParam({ name: 'id', description: 'UUID da transação' })
  @ApiResponse({ status: 204, description: 'Transação removida com sucesso' })
  @ApiResponse({ status: 404, description: 'Transação não encontrada' })
  async remove(
    @CurrentUser() user: User,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    await this.transactionsService.remove(id, user.id);
  }
}
