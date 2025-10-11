import { NestFactory } from "@nestjs/core";
import { AppModule } from "../src/app.module";
import { CreateCarrierDto } from "../src/application/dto/create-carrier.dto";
import { CarrierService } from "../src/application/services/carrier.service";

async function seedData() {
  console.log("🌱 Starting Carrier Service data seeding...");

  const app = await NestFactory.createApplicationContext(AppModule);
  const carrierService = app.get(CarrierService);

  try {
    // Clear existing data
    console.log("🧹 Clearing existing carriers...");
    // Note: In a real scenario, you might want to be more selective about clearing data

    // Create sample carriers
    const sampleCarriers: CreateCarrierDto[] = [
      {
        name: "FedEx Express",
        description: "Fast and reliable express shipping worldwide",
        contactEmail: "support@fedex.com",
        contactPhone: "+1-800-463-3339",
        metadata: {
          code: "FEDEX",
          website: "https://www.fedex.com",
          trackingUrl: "https://www.fedex.com/fedextrack",
          serviceTypes: ["Express", "Ground", "Freight"],
          coverage: ["US", "Canada", "Mexico", "Europe", "Asia"],
          pricing: {
            baseRate: 15.99,
            currency: "USD",
            perKgRate: 2.5,
          },
        },
      },
      {
        name: "UPS",
        description: "United Parcel Service - global logistics leader",
        contactEmail: "customer.service@ups.com",
        contactPhone: "+1-800-742-5877",
        metadata: {
          code: "UPS",
          website: "https://www.ups.com",
          trackingUrl: "https://www.ups.com/track",
          serviceTypes: ["Next Day Air", "2nd Day Air", "Ground"],
          coverage: ["US", "Canada", "Europe", "Asia-Pacific"],
          pricing: {
            baseRate: 12.99,
            currency: "USD",
            perKgRate: 2.25,
          },
        },
      },
      {
        name: "DHL Express",
        description: "International express shipping and logistics",
        contactEmail: "info@dhl.com",
        contactPhone: "+1-800-225-5345",
        metadata: {
          code: "DHL",
          website: "https://www.dhl.com",
          trackingUrl: "https://www.dhl.com/tracking",
          serviceTypes: ["Express", "Economy", "Freight"],
          coverage: ["Global", "220+ Countries"],
          pricing: {
            baseRate: 18.99,
            currency: "USD",
            perKgRate: 3.0,
          },
        },
      },
      {
        name: "USPS",
        description:
          "United States Postal Service - domestic and international mail",
        contactEmail: "usps@usps.gov",
        contactPhone: "+1-800-275-8777",
        metadata: {
          code: "USPS",
          website: "https://www.usps.com",
          trackingUrl: "https://tools.usps.com/go/TrackConfirmAction",
          serviceTypes: ["Priority Mail", "First-Class", "Ground Advantage"],
          coverage: ["US", "International"],
          pricing: {
            baseRate: 8.99,
            currency: "USD",
            perKgRate: 1.5,
          },
        },
      },
    ];

    console.log("🚚 Creating sample carriers...");
    for (const carrierData of sampleCarriers) {
      try {
        const carrier = await carrierService.create(carrierData);
        console.log(
          `✅ Created carrier: ${carrier.name} (${carrier.metadata?.code})`
        );
      } catch (error) {
        if (error.message.includes("Carrier name already exists")) {
          console.log(`⚠️  Carrier already exists: ${carrierData.name}`);
        } else {
          console.error(
            `❌ Error creating carrier ${carrierData.name}:`,
            error.message
          );
        }
      }
    }

    // Get total count
    const count = await carrierService.getCount();
    console.log(`📊 Total carriers in database: ${count.count}`);

    console.log("🎉 Carrier Service seeding completed successfully!");
  } catch (error) {
    console.error("❌ Error during seeding:", error);
  } finally {
    await app.close();
  }
}

// Run seeding
seedData().catch(console.error);





