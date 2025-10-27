import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class InitialSchema1761568468247 implements MigrationInterface {
  name = "InitialSchema1761568468247";

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Check if carriers table already exists
    const tableExists = await queryRunner.hasTable("carriers");

    if (!tableExists) {
      await queryRunner.createTable(
        new Table({
          name: "carriers",
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
              name: "name",
              type: "varchar",
              length: "255",
              isUnique: true,
            },
            {
              name: "description",
              type: "text",
              isNullable: true,
            },
            {
              name: "isActive",
              type: "tinyint",
              default: 1,
            },
            {
              name: "contactEmail",
              type: "varchar",
              length: "255",
              isNullable: true,
            },
            {
              name: "contactPhone",
              type: "varchar",
              length: "50",
              isNullable: true,
            },
            {
              name: "metadata",
              type: "json",
              isNullable: true,
            },
          ],
        }),
        true
      );
    }

    // Create indexes with existence checks (MySQL compatible)
    const table = await queryRunner.getTable("carriers");

    // Index 1: Unique index on name (IDX_bf89e84cb884955e40bfb825e1)
    if (!table?.indices.find((idx) => idx.name === "IDX_bf89e84cb884955e40bfb825e1")) {
      await queryRunner.query(
        `CREATE UNIQUE INDEX IDX_bf89e84cb884955e40bfb825e1 ON carriers (name)`
      );
    }

    // Index 2: Index on createdAt (IDX_86daa3ee1f90755b6416fd25e3)
    if (!table?.indices.find((idx) => idx.name === "IDX_86daa3ee1f90755b6416fd25e3")) {
      await queryRunner.query(
        `CREATE INDEX IDX_86daa3ee1f90755b6416fd25e3 ON carriers (createdAt)`
      );
    }

    // Index 3: Index on isActive (IDX_f0f0d1f912ae38d25fae14a5b3)
    if (!table?.indices.find((idx) => idx.name === "IDX_f0f0d1f912ae38d25fae14a5b3")) {
      await queryRunner.query(
        `CREATE INDEX IDX_f0f0d1f912ae38d25fae14a5b3 ON carriers (isActive)`
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop indexes in reverse order
    await queryRunner.query(`DROP INDEX IDX_f0f0d1f912ae38d25fae14a5b3 ON carriers`);
    await queryRunner.query(`DROP INDEX IDX_86daa3ee1f90755b6416fd25e3 ON carriers`);
    await queryRunner.query(`DROP INDEX IDX_bf89e84cb884955e40bfb825e1 ON carriers`);

    // Drop table
    await queryRunner.dropTable("carriers");
  }
}
