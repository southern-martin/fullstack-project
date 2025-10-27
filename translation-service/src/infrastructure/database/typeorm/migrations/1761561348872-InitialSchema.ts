import { MigrationInterface, QueryRunner } from "typeorm";

/**
 * Initial Schema Migration for Translation Service
 * 
 * This migration documents the existing database schema created by TypeORM synchronize.
 * It creates all necessary tables and indexes for the Translation Service.
 * 
 * Tables:
 * - languages: Stores language configurations (code, name, flag, etc.)
 * - language_values: Stores translations with MD5-hashed keys
 * 
 * Created: October 27, 2025
 */
export class InitialSchema1761561348872 implements MigrationInterface {
    name = 'InitialSchema1761561348872'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Check if tables exist before creating
        const languagesTableExists = await queryRunner.hasTable("languages");
        const languageValuesTableExists = await queryRunner.hasTable("language_values");

        // Create languages table if it doesn't exist
        if (!languagesTableExists) {
            await queryRunner.query(`
                CREATE TABLE \`languages\` (
                    \`code\` varchar(5) NOT NULL,
                    \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                    \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                    \`name\` varchar(100) NOT NULL,
                    \`localName\` varchar(100) NULL,
                    \`flag\` varchar(10) NULL,
                    \`status\` enum('active', 'inactive') NOT NULL DEFAULT 'active',
                    \`isDefault\` tinyint NOT NULL DEFAULT 0,
                    \`direction\` enum('ltr', 'rtl') NOT NULL DEFAULT 'ltr',
                    PRIMARY KEY (\`code\`)
                ) ENGINE=InnoDB
            `);
        }

        // Create language_values table if it doesn't exist
        if (!languageValuesTableExists) {
            await queryRunner.query(`
                CREATE TABLE \`language_values\` (
                    \`id\` int NOT NULL AUTO_INCREMENT,
                    \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                    \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                    \`key\` varchar(32) NOT NULL,
                    \`value\` text NOT NULL,
                    \`original\` text NOT NULL,
                    \`module\` varchar(100) NULL,
                    \`category\` varchar(100) NULL,
                    \`isApproved\` tinyint NOT NULL DEFAULT 0,
                    \`usageCount\` int NOT NULL DEFAULT 0,
                    \`lastUsedAt\` datetime NULL,
                    \`languageCode\` varchar(5) NOT NULL,
                    PRIMARY KEY (\`id\`),
                    UNIQUE KEY \`IDX_0189dafa08bd1a12a3f627caa8\` (\`key\`),
                    CONSTRAINT \`FK_language_values_language\` FOREIGN KEY (\`languageCode\`) REFERENCES \`languages\` (\`code\`) ON DELETE NO ACTION ON UPDATE NO ACTION
                ) ENGINE=InnoDB
            `);
        }

        // Create indexes for languages table (checking existence first)
        const languagesTable = await queryRunner.getTable("languages");
        
        if (!languagesTable?.indices.find(idx => idx.name === "IDX_cc48d3636e11e562770d5cdde1")) {
            await queryRunner.query(`CREATE INDEX \`IDX_cc48d3636e11e562770d5cdde1\` ON \`languages\` (\`status\`)`);
        }
        
        if (!languagesTable?.indices.find(idx => idx.name === "IDX_81b39a5ea76d4a17962cffced5")) {
            await queryRunner.query(`CREATE INDEX \`IDX_81b39a5ea76d4a17962cffced5\` ON \`languages\` (\`isDefault\`)`);
        }
        
        if (!languagesTable?.indices.find(idx => idx.name === "IDX_dd2c55056f3c104e03c9b234a4")) {
            await queryRunner.query(`CREATE INDEX \`IDX_dd2c55056f3c104e03c9b234a4\` ON \`languages\` (\`createdAt\`)`);
        }

        // Create indexes for language_values table (checking existence first)
        const languageValuesTable = await queryRunner.getTable("language_values");
        
        if (!languageValuesTable?.indices.find(idx => idx.name === "IDX_ad275697c301e8f4208e4f7934")) {
            await queryRunner.query(`CREATE INDEX \`IDX_ad275697c301e8f4208e4f7934\` ON \`language_values\` (\`languageCode\`)`);
        }
        
        if (!languageValuesTable?.indices.find(idx => idx.name === "IDX_5e2a4b91c5e339695531ed4094")) {
            await queryRunner.query(`CREATE INDEX \`IDX_5e2a4b91c5e339695531ed4094\` ON \`language_values\` (\`isApproved\`)`);
        }
        
        if (!languageValuesTable?.indices.find(idx => idx.name === "IDX_7b24afc8750127ec50f38a02d9")) {
            await queryRunner.query(`CREATE INDEX \`IDX_7b24afc8750127ec50f38a02d9\` ON \`language_values\` (\`createdAt\`)`);
        }
        
        if (!languageValuesTable?.indices.find(idx => idx.name === "IDX_72059dbfa423c9a41ffbfada73")) {
            await queryRunner.query(`CREATE INDEX \`IDX_72059dbfa423c9a41ffbfada73\` ON \`language_values\` (\`usageCount\`)`);
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop indexes for language_values table
        await queryRunner.query(`DROP INDEX \`IDX_72059dbfa423c9a41ffbfada73\` ON \`language_values\``);
        await queryRunner.query(`DROP INDEX \`IDX_7b24afc8750127ec50f38a02d9\` ON \`language_values\``);
        await queryRunner.query(`DROP INDEX \`IDX_5e2a4b91c5e339695531ed4094\` ON \`language_values\``);
        await queryRunner.query(`DROP INDEX \`IDX_ad275697c301e8f4208e4f7934\` ON \`language_values\``);

        // Drop indexes for languages table
        await queryRunner.query(`DROP INDEX \`IDX_dd2c55056f3c104e03c9b234a4\` ON \`languages\``);
        await queryRunner.query(`DROP INDEX \`IDX_81b39a5ea76d4a17962cffced5\` ON \`languages\``);
        await queryRunner.query(`DROP INDEX \`IDX_cc48d3636e11e562770d5cdde1\` ON \`languages\``);

        // Drop tables
        await queryRunner.query(`DROP TABLE \`language_values\``);
        await queryRunner.query(`DROP TABLE \`languages\``);
    }

}
