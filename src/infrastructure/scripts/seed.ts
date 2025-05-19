import bcrypt from 'bcrypt';
import { getPool } from '../config/database';
import { UserRole } from '../../domain/entities/User';

const seedDatabase = async () => {
  const pool = getPool();
  try {
    const saltRounds = 10;
    const adminPassword = await bcrypt.hash('admin123', saltRounds);
    const userPassword = await bcrypt.hash('user123', saltRounds);

    await pool.query(`
      INSERT INTO users (username, email, password, role, created_at, updated_at)
      VALUES 
        ('admin', 'admin@example.com', $1, $2, NOW(), NOW()),
        ('user', 'user@example.com', $3, $4, NOW(), NOW())
      ON CONFLICT (username) DO NOTHING
    `, [adminPassword, UserRole.ADMIN, userPassword, UserRole.USER]);

    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
    
    const twoMonthsAgo = new Date();
    twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);
    
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    lastMonth.setDate(15);
    
    const thisMonth = new Date();
    
    const companiesResult = await pool.query(`
      INSERT INTO companies (cuit, business_name, adhesion_date, created_at, updated_at)
      VALUES 
        ('30-12345678-0', 'Empresa Antigua SA', $1, NOW(), NOW()),
        ('30-23456789-1', 'Comercial Reciente SRL', $2, NOW(), NOW()),
        ('30-34567890-2', 'Servicios Modernos SA', $3, NOW(), NOW()),
        ('30-45678901-3', 'Nueva Empresa SA', $4, NOW(), NOW())
      ON CONFLICT (cuit) DO NOTHING
      RETURNING id, cuit, business_name as "businessName"
    `, [threeMonthsAgo, twoMonthsAgo, lastMonth, thisMonth]);

    const companies = companiesResult.rows;
    console.log('Companies seeded:', companies);

    if (companies.length > 0) {
      if (companies[0]) {
        const oldCompanyLastMonthDate = new Date(lastMonth);
        const oldCompanyThisMonthDate = new Date();
        
        await pool.query(`
          INSERT INTO transfers (amount, company_id, debit_account, credit_account, transfer_date, created_at, updated_at)
          VALUES 
            ($1, $2, $3, $4, $5, NOW(), NOW()),
            ($6, $7, $8, $9, $10, NOW(), NOW())
          ON CONFLICT DO NOTHING
        `, [
          10000.50, companies[0].id, '1234567890', '0987654321', oldCompanyLastMonthDate,
          15000.75, companies[0].id, '1234567890', '5678901234', oldCompanyThisMonthDate
        ]);
      }
      
      if (companies[1]) {
        const recentCompanyLastMonthDate = new Date(lastMonth);
        recentCompanyLastMonthDate.setDate(recentCompanyLastMonthDate.getDate() + 5);
        
        await pool.query(`
          INSERT INTO transfers (amount, company_id, debit_account, credit_account, transfer_date, created_at, updated_at)
          VALUES 
            ($1, $2, $3, $4, $5, NOW(), NOW())
          ON CONFLICT DO NOTHING
        `, [
          25000.30, companies[1].id, '2345678901', '1098765432', recentCompanyLastMonthDate
        ]);
      }
      
      if (companies[2]) {
        const modernCompanyThisMonthDate = new Date();
        
        await pool.query(`
          INSERT INTO transfers (amount, company_id, debit_account, credit_account, transfer_date, created_at, updated_at)
          VALUES 
            ($1, $2, $3, $4, $5, NOW(), NOW())
          ON CONFLICT DO NOTHING
        `, [
          35000.25, companies[2].id, '3456789012', '2109876543', modernCompanyThisMonthDate
        ]);
      }
    }

    console.log('Seed completed successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await pool.end();
  }
};

seedDatabase();