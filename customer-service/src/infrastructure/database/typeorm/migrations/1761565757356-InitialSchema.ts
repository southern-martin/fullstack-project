import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class InitialSchema1761565757356 implements MigrationInterface {
  name = "InitialSchema1761565757356";

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Check if customers table already exists
    const tableExists = await queryRunner.hasTable("customers");

    if (!tableExists) {
      await queryRunner.createTable(
        new Table({
          name: "customers",
          columns: [
            {
              name: "id",
              type: "int",
              isPrimary: true,
              isGenerated: true,
              generationStrategy: "increment",
            },
            {
              name: "createdAt",
              type: "datetime",
              precision: 6,
              default: "CURRENT_TIMESTAMP(6)",
            },
            {
              name: "updatedAt",
              type: "datetime",
              precision: 6,
              default: "CURRENT_TIMESTAMP(6)",
              onUpdate: "CURRENT_TIMESTAMP(6)",
            },
            {
              name: "email",
              type: "varchar",
              length: "255",
              isUnique: true,
            },
            {
              name: "firstName",
              type: "varchar",
              length: "255",
            },
            {
              name: "lastName",
              type: "varchar",
              length: "255",
            },
            {
              name: "phone",
              type: "varchar",
              length: "255",
              isNullable: true,
            },
            {
              name: "isActive",
              type: "tinyint",
              default: 1,
            },
            {
              name: "dateOfBirth",
              type: "date",
              isNullable: true,
            },
            {
              name: "address",
              type: "json",
              isNullable: true,
            },
            {
              name: "preferences",
              type: "json",
              isNullable: true,
            },
          ],
        }),
        true
      );
    }

    // Create indexes with existence checks (MySQL compatible)
    const table = await queryRunner.getTable("customers");

    // Index 1: Unique index on email (IDX_8536b8b85c06969f84f0c098b0)
    if (!table?.indices.find((idx) => idx.name === "IDX_8536b8b85c06969f84f0c098b0")) {
      await queryRunner.query(
        `CREATE UNIQUE INDEX IDX_8536b8b85c06969f84f0c098b0 ON customers (email)`
      );
    }

    // Index 2: Index on createdAt (IDX_2cf358083303634803f1dfb763)
    if (!table?.indices.find((idx) => idx.name === "IDX_2cf358083303634803f1dfb763")) {
      await queryRunner.query(
        `CREATE INDEX IDX_2cf358083303634803f1dfb763 ON customers (createdAt)`
      );
    }

    // Index 3: Index on lastName (IDX_8e11140e3639e6d35a9f79f980)
    if (!table?.indices.find((idx) => idx.name === "IDX_8e11140e3639e6d35a9f79f980")) {
      await queryRunner.query(
        `CREATE INDEX IDX_8e11140e3639e6d35a9f79f980 ON customers (lastName)`
      );
    }

    // Index 4: Composite index on isActive, createdAt (IDX_2292685bb121246ec926a82b31)
    if (!table?.indices.find((idx) => idx.name === "IDX_2292685bb121246ec926a82b31")) {
      await queryRunner.query(
        `CREATE INDEX IDX_2292685bb121246ec926a82b31 ON customers (isActive, createdAt)`
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop indexes in reverse order
    await queryRunner.query(`DROP INDEX IDX_2292685bb121246ec926a82b31 ON customers`);
    await queryRunner.query(`DROP INDEX IDX_8e11140e3639e6d35a9f79f980 ON customers`);
    await queryRunner.query(`DROP INDEX IDX_2cf358083303634803f1dfb763 ON customers`);
    await queryRunner.query(`DROP INDEX IDX_8536b8b85c06969f84f0c098b0 ON customers`);

    // Drop table
    await queryRunner.dropTable("customers");
  }
}
