import { MigrationInterface, QueryRunner, Table, TableIndex } from "typeorm";

/**
 * Initial Schema Migration for Pricing Service
 * Creates pricing_rules and price_calculations tables
 * 
 * Generated: 2025-10-27
 * Version: 1.0.0
 */
export class InitialSchema1730013600000 implements MigrationInterface {
  name = "InitialSchema1730013600000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create pricing_rules table
    await queryRunner.createTable(
      new Table({
        name: "pricing_rules",
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
            default: "CURRENT_TIMESTAMP",
          },
          {
            name: "updatedAt",
            type: "datetime",
            default: "CURRENT_TIMESTAMP",
            onUpdate: "CURRENT_TIMESTAMP",
          },
          {
            name: "name",
            type: "varchar",
            length: "255",
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
            name: "conditions",
            type: "json",
            comment: "JSON object containing rule matching conditions (carrierId, serviceType, weight/distance ranges, countries, customerType)",
          },
          {
            name: "pricing",
            type: "json",
            comment: "JSON object containing pricing details (baseRate, currency, rates, charges, surcharges, discounts)",
          },
          {
            name: "priority",
            type: "int",
            default: 0,
            comment: "Higher priority rules are evaluated first",
          },
          {
            name: "validFrom",
            type: "date",
            isNullable: true,
          },
          {
            name: "validTo",
            type: "date",
            isNullable: true,
          },
        ],
      }),
      true
    );

    // Create indexes for pricing_rules
    await queryRunner.createIndex(
      "pricing_rules",
      new TableIndex({
        name: "IDX_pricing_rules_name",
        columnNames: ["name"],
      })
    );

    await queryRunner.createIndex(
      "pricing_rules",
      new TableIndex({
        name: "IDX_pricing_rules_isActive",
        columnNames: ["isActive"],
      })
    );

    await queryRunner.createIndex(
      "pricing_rules",
      new TableIndex({
        name: "IDX_pricing_rules_priority",
        columnNames: ["priority"],
      })
    );

    await queryRunner.createIndex(
      "pricing_rules",
      new TableIndex({
        name: "IDX_pricing_rules_validFrom_validTo",
        columnNames: ["validFrom", "validTo"],
      })
    );

    await queryRunner.createIndex(
      "pricing_rules",
      new TableIndex({
        name: "IDX_pricing_rules_createdAt",
        columnNames: ["createdAt"],
      })
    );

    // Create price_calculations table
    await queryRunner.createTable(
      new Table({
        name: "price_calculations",
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
            default: "CURRENT_TIMESTAMP",
          },
          {
            name: "updatedAt",
            type: "datetime",
            default: "CURRENT_TIMESTAMP",
            onUpdate: "CURRENT_TIMESTAMP",
          },
          {
            name: "requestId",
            type: "varchar",
            length: "255",
            isUnique: true,
          },
          {
            name: "request",
            type: "json",
            comment: "JSON object containing original request (carrierId, serviceType, weight, distance, countries, customerType/Id)",
          },
          {
            name: "calculation",
            type: "json",
            comment: "JSON object containing calculation breakdown (rates, surcharges, discounts, subtotal, total, currency)",
          },
          {
            name: "appliedRules",
            type: "json",
            isNullable: true,
            comment: "JSON array of applied pricing rules (ruleId, ruleName, priority)",
          },
          {
            name: "calculatedAt",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
          },
        ],
      }),
      true
    );

    // Create indexes for price_calculations
    await queryRunner.createIndex(
      "price_calculations",
      new TableIndex({
        name: "IDX_price_calculations_calculatedAt",
        columnNames: ["calculatedAt"],
      })
    );

    await queryRunner.createIndex(
      "price_calculations",
      new TableIndex({
        name: "IDX_price_calculations_createdAt",
        columnNames: ["createdAt"],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop price_calculations table and its indexes
    await queryRunner.dropIndex("price_calculations", "IDX_price_calculations_createdAt");
    await queryRunner.dropIndex("price_calculations", "IDX_price_calculations_calculatedAt");
    await queryRunner.dropTable("price_calculations");

    // Drop pricing_rules table and its indexes
    await queryRunner.dropIndex("pricing_rules", "IDX_pricing_rules_createdAt");
    await queryRunner.dropIndex("pricing_rules", "IDX_pricing_rules_validFrom_validTo");
    await queryRunner.dropIndex("pricing_rules", "IDX_pricing_rules_priority");
    await queryRunner.dropIndex("pricing_rules", "IDX_pricing_rules_isActive");
    await queryRunner.dropIndex("pricing_rules", "IDX_pricing_rules_name");
    await queryRunner.dropTable("pricing_rules");
  }
}
