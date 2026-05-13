import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';

dotenv.config();

async function runSeeds() {
  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'financial_db',
    entities: [__dirname + '/../../**/*.entity{.ts,.js}'],
    synchronize: true,
  });

  await dataSource.initialize();
  console.log('📦 Conexão com banco estabelecida\n');

  // Seed users
  const hashedPassword = await bcrypt.hash('Senha@123', 12);

  await dataSource.query(`
    INSERT INTO users (id, name, email, password, created_at, updated_at)
    VALUES 
      (gen_random_uuid(), 'Maria Silva', 'maria@email.com', '${hashedPassword}', NOW(), NOW()),
      (gen_random_uuid(), 'Carlos Souza', 'carlos@email.com', '${hashedPassword}', NOW(), NOW())
    ON CONFLICT (email) DO NOTHING
  `);
  console.log('✅ Usuários criados: maria@email.com | carlos@email.com (senha: Senha@123)');

  // Seed transactions
  const users = await dataSource.query(`SELECT id FROM users LIMIT 2`);
  const userId = users[0]?.id;

  if (userId) {
    await dataSource.query(`
      INSERT INTO transactions (id, description, amount, type, category, transaction_date, user_id, created_at, updated_at)
      VALUES
        (gen_random_uuid(), 'Salário', 5000.00, 'income', 'Trabalho', CURRENT_DATE, '${userId}', NOW(), NOW()),
        (gen_random_uuid(), 'Aluguel', 1200.00, 'expense', 'Moradia', CURRENT_DATE, '${userId}', NOW(), NOW()),
        (gen_random_uuid(), 'Supermercado', 450.75, 'expense', 'Alimentação', CURRENT_DATE, '${userId}', NOW(), NOW()),
        (gen_random_uuid(), 'Freelance', 1500.00, 'income', 'Trabalho', CURRENT_DATE, '${userId}', NOW(), NOW()),
        (gen_random_uuid(), 'Energia elétrica', 180.00, 'expense', 'Utilidades', CURRENT_DATE, '${userId}', NOW(), NOW())
    `);
    console.log('✅ 5 transações de exemplo criadas para maria@email.com');
  }

  await dataSource.destroy();
  console.log('\n🌱 Seed concluído com sucesso!');
}

runSeeds().catch((err) => {
  console.error('❌ Erro no seed:', err);
  process.exit(1);
});
