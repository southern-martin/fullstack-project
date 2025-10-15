import { NestFactory } from "@nestjs/core";
import { AppModule } from "../src/app.module";
import { CreatePricingRuleDto } from "../src/application/dto/create-pricing-rule.dto";
import { CalculatePriceUseCase } from "../src/application/use-cases/calculate-price.use-case";
import { ManagePricingRuleUseCase } from "../src/application/use-cases/manage-pricing-rule.use-case";

async function seedData() {
  console.log("🌱 Starting Pricing Service data seeding...");

  const app = await NestFactory.createApplicationContext(AppModule);
  const managePricingRuleUseCase = app.get(ManagePricingRuleUseCase);
  const calculatePriceUseCase = app.get(CalculatePriceUseCase);

  try {
    // Clear existing data
    console.log("🧹 Clearing existing pricing rules...");
    // Note: In a real scenario, you might want to be more selective about clearing data

    // Create sample pricing rules
    const samplePricingRules: CreatePricingRuleDto[] = [
      {
        name: "FedEx Express Domestic",
        description: "Standard pricing for FedEx Express domestic shipments",
        conditions: {
          carrierId: 1, // FedEx
          serviceType: "Express",
          originCountry: "US",
          destinationCountry: "US",
        },
        pricing: {
          baseRate: 15.99,
          currency: "USD",
          perKgRate: 2.5,
          minimumCharge: 12.99,
          maximumCharge: 500.0,
          surcharges: [
            {
              type: "Fuel Surcharge",
              percentage: 8.5,
            },
            {
              type: "Weekend Delivery",
              amount: 5.0,
            },
          ],
        },
        priority: 100,
      },
      {
        name: "UPS Ground Domestic",
        description: "Standard pricing for UPS Ground domestic shipments",
        conditions: {
          carrierId: 2, // UPS
          serviceType: "Ground",
          originCountry: "US",
          destinationCountry: "US",
        },
        pricing: {
          baseRate: 12.99,
          currency: "USD",
          perKgRate: 2.25,
          minimumCharge: 8.99,
          maximumCharge: 400.0,
          discounts: [
            {
              type: "Volume Discount",
              percentage: 5.0,
            },
          ],
        },
        priority: 90,
      },
      {
        name: "DHL International Express",
        description: "International express shipping with DHL",
        conditions: {
          carrierId: 3, // DHL
          serviceType: "Express",
          originCountry: "US",
        },
        pricing: {
          baseRate: 18.99,
          currency: "USD",
          perKgRate: 3.0,
          minimumCharge: 15.99,
          maximumCharge: 1000.0,
          surcharges: [
            {
              type: "International Surcharge",
              amount: 10.0,
            },
            {
              type: "Customs Handling",
              amount: 5.0,
            },
          ],
        },
        priority: 95,
      },
      {
        name: "USPS Priority Mail",
        description: "USPS Priority Mail domestic service",
        conditions: {
          carrierId: 4, // USPS
          serviceType: "Priority Mail",
          originCountry: "US",
          destinationCountry: "US",
        },
        pricing: {
          baseRate: 8.99,
          currency: "USD",
          perKgRate: 1.5,
          minimumCharge: 6.99,
          maximumCharge: 200.0,
        },
        priority: 80,
      },
      {
        name: "Heavy Package Surcharge",
        description: "Additional charge for packages over 20kg",
        conditions: {
          weightRange: {
            min: 20,
            max: 999,
          },
        },
        pricing: {
          baseRate: 0,
          currency: "USD",
          surcharges: [
            {
              type: "Heavy Package",
              amount: 15.0,
            },
          ],
        },
        priority: 50,
      },
      {
        name: "Premium Customer Discount",
        description: "Discount for premium customers",
        conditions: {
          customerType: "premium",
        },
        pricing: {
          baseRate: 0,
          currency: "USD",
          discounts: [
            {
              type: "Premium Customer",
              percentage: 10.0,
            },
          ],
        },
        priority: 200,
      },
    ];

    console.log("💰 Creating sample pricing rules...");
    for (const ruleData of samplePricingRules) {
      try {
        const rule = await managePricingRuleUseCase.create(ruleData);
        console.log(
          `✅ Created pricing rule: ${rule.name} (Priority: ${rule.priority})`
        );
      } catch (error) {
        console.error(
          `❌ Error creating pricing rule ${ruleData.name}:`,
          error.message
        );
      }
    }

    // Get total count
    const count = await managePricingRuleUseCase.getCount();
    console.log(`📊 Total pricing rules in database: ${count.count}`);

    // Test price calculation
    console.log("🧮 Testing price calculation...");
    try {
      const testCalculation = await calculatePriceUseCase.execute({
        carrierId: 1,
        serviceType: "Express",
        weight: 5,
        originCountry: "US",
        destinationCountry: "US",
        customerType: "premium",
      });
      console.log(
        `✅ Test calculation successful: $${testCalculation.calculation.total} ${testCalculation.calculation.currency}`
      );
    } catch (error) {
      console.error("❌ Error in test calculation:", error.message);
    }

    console.log("🎉 Pricing Service seeding completed successfully!");
  } catch (error) {
    console.error("❌ Error during seeding:", error);
  } finally {
    await app.close();
  }
}

// Run seeding
seedData().catch(console.error);
