import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateSellersTable1761790708287 implements MigrationInterface {
  name = 'CreateSellersTable1761790708287';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`sellers\` (\`id\` int NOT NULL AUTO_INCREMENT, \`user_id\` int NOT NULL, \`business_name\` varchar(255) NOT NULL, \`business_type\` enum ('individual', 'sole_proprietor', 'llc', 'corporation', 'partnership') NOT NULL DEFAULT 'individual', \`business_email\` varchar(255) NULL, \`business_phone\` varchar(50) NULL, \`tax_id\` varchar(100) NULL, \`business_address\` text NULL, \`business_city\` varchar(100) NULL, \`business_state\` varchar(100) NULL, \`business_country\` varchar(100) NULL, \`business_postal_code\` varchar(20) NULL, \`logo_url\` varchar(500) NULL, \`description\` text NULL, \`website\` varchar(255) NULL, \`status\` enum ('pending', 'active', 'suspended', 'rejected') NOT NULL DEFAULT 'pending', \`verification_status\` enum ('unverified', 'pending', 'verified', 'rejected') NOT NULL DEFAULT 'unverified', \`verified_at\` timestamp NULL, \`verified_by\` int NULL, \`rejection_reason\` text NULL, \`suspension_reason\` text NULL, \`rating\` decimal(3,2) NOT NULL DEFAULT '0.00', \`total_reviews\` int NOT NULL DEFAULT '0', \`total_products\` int NOT NULL DEFAULT '0', \`total_sales\` int NOT NULL DEFAULT '0', \`total_revenue\` decimal(12,2) NOT NULL DEFAULT '0.00', \`commission_rate\` decimal(5,2) NULL, \`bank_name\` varchar(255) NULL, \`bank_account_holder\` varchar(255) NULL, \`bank_account_number\` varchar(255) NULL, \`bank_routing_number\` varchar(50) NULL, \`payment_method\` varchar(50) NULL DEFAULT 'bank_transfer', \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`last_login_at\` timestamp NULL, UNIQUE INDEX \`idx_user_id_unique\` (\`user_id\`), INDEX \`idx_business_name\` (\`business_name\`), INDEX \`idx_created_at\` (\`created_at\`), INDEX \`idx_rating\` (\`rating\`), INDEX \`idx_verification_status\` (\`verification_status\`), INDEX \`idx_status\` (\`status\`), INDEX \`idx_user_id\` (\`user_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX \`idx_user_id\` ON \`sellers\``);
    await queryRunner.query(`DROP INDEX \`idx_status\` ON \`sellers\``);
    await queryRunner.query(`DROP INDEX \`idx_verification_status\` ON \`sellers\``);
    await queryRunner.query(`DROP INDEX \`idx_rating\` ON \`sellers\``);
    await queryRunner.query(`DROP INDEX \`idx_created_at\` ON \`sellers\``);
    await queryRunner.query(`DROP INDEX \`idx_business_name\` ON \`sellers\``);
    await queryRunner.query(`DROP INDEX \`idx_user_id_unique\` ON \`sellers\``);
    await queryRunner.query(`DROP TABLE \`sellers\``);
  }
}
