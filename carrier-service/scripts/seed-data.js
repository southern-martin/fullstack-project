const { NestFactory } = require("@nestjs/core");
const { AppModule } = require("../dist/carrier-service/src/app.module");
const { CreateCarrierUseCase } = require("../dist/carrier-service/src/application/use-cases/create-carrier.use-case");

async function seedData() {
  console.log("🌱 Starting Carrier Service data seeding...");

  const app = await NestFactory.createApplicationContext(AppModule.AppModule || AppModule);
  const createCarrierUseCase = app.get(CreateCarrierUseCase.CreateCarrierUseCase || CreateCarrierUseCase);

  try {
    // Clear existing data
    console.log("🧹 Clearing existing carriers...");

    // Create sample carriers - Most common carriers worldwide
    const sampleCarriers = [
      // Major US Carriers
      {
        name: "FedEx Express",
        description: "Fast and reliable express shipping worldwide",
        contactEmail: "support@fedex.com",
        contactPhone: "+1-800-463-3339",
        metadata: {
          code: "FEDEX",
          website: "https://www.fedex.com",
          trackingUrl: "https://www.fedex.com/fedextrack",
          serviceTypes: ["Express", "Ground", "Freight", "Home Delivery"],
          coverage: ["US", "Canada", "Mexico", "Europe", "Asia", "220+ Countries"],
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
          serviceTypes: ["Next Day Air", "2nd Day Air", "Ground", "Freight"],
          coverage: ["US", "Canada", "Europe", "Asia-Pacific", "Latin America"],
          pricing: {
            baseRate: 12.99,
            currency: "USD",
            perKgRate: 2.25,
          },
        },
      },
      {
        name: "USPS",
        description: "United States Postal Service - domestic and international mail",
        contactEmail: "usps@usps.gov",
        contactPhone: "+1-800-275-8777",
        metadata: {
          code: "USPS",
          website: "https://www.usps.com",
          trackingUrl: "https://tools.usps.com/go/TrackConfirmAction",
          serviceTypes: ["Priority Mail", "First-Class", "Ground Advantage", "Priority Mail Express"],
          coverage: ["US", "International"],
          pricing: {
            baseRate: 8.99,
            currency: "USD",
            perKgRate: 1.5,
          },
        },
      },

      // Major International Carriers
      {
        name: "DHL Express",
        description: "International express shipping and logistics",
        contactEmail: "info@dhl.com",
        contactPhone: "+1-800-225-5345",
        metadata: {
          code: "DHL",
          website: "https://www.dhl.com",
          trackingUrl: "https://www.dhl.com/tracking",
          serviceTypes: ["Express", "Economy", "Freight", "Same Day"],
          coverage: ["Global", "220+ Countries"],
          pricing: {
            baseRate: 18.99,
            currency: "USD",
            perKgRate: 3.0,
          },
        },
      },
      {
        name: "DHL eCommerce",
        description: "E-commerce shipping solutions for online retailers",
        contactEmail: "ecommerce@dhl.com",
        contactPhone: "+1-800-805-9306",
        metadata: {
          code: "DHL_ECOM",
          website: "https://www.dhl.com/us-en/home/our-divisions/ecommerce.html",
          trackingUrl: "https://www.dhl.com/tracking",
          serviceTypes: ["Parcel Direct", "Parcel Plus", "Parcel Expedited"],
          coverage: ["US", "International"],
          pricing: {
            baseRate: 7.99,
            currency: "USD",
            perKgRate: 1.75,
          },
        },
      },
      {
        name: "Amazon Logistics",
        description: "Amazon's own delivery network for fast Prime shipping",
        contactEmail: "logistics@amazon.com",
        contactPhone: "+1-888-280-4331",
        metadata: {
          code: "AMAZON",
          website: "https://www.amazon.com/logistics",
          trackingUrl: "https://www.amazon.com/progress-tracker/",
          serviceTypes: ["Standard", "Prime Same Day", "Prime Next Day"],
          coverage: ["US", "UK", "Europe", "Japan", "India"],
          pricing: {
            baseRate: 0.0,
            currency: "USD",
            perKgRate: 0.0,
          },
        },
      },
      {
        name: "Canada Post",
        description: "National postal service of Canada",
        contactEmail: "info@canadapost.ca",
        contactPhone: "+1-866-607-6301",
        metadata: {
          code: "CANADA_POST",
          website: "https://www.canadapost.ca",
          trackingUrl: "https://www.canadapost.ca/track",
          serviceTypes: ["Regular Mail", "Xpresspost", "Priority", "Expedited Parcel"],
          coverage: ["Canada", "US", "International"],
          pricing: {
            baseRate: 12.99,
            currency: "CAD",
            perKgRate: 2.0,
          },
        },
      },
      {
        name: "Royal Mail",
        description: "UK's national postal service",
        contactEmail: "customer.service@royalmail.com",
        contactPhone: "+44-345-774-0740",
        metadata: {
          code: "ROYAL_MAIL",
          website: "https://www.royalmail.com",
          trackingUrl: "https://www.royalmail.com/track-your-item",
          serviceTypes: ["First Class", "Second Class", "Special Delivery", "International"],
          coverage: ["UK", "International"],
          pricing: {
            baseRate: 3.99,
            currency: "GBP",
            perKgRate: 1.5,
          },
        },
      },
      {
        name: "SF Express",
        description: "Leading Chinese express delivery company",
        contactEmail: "service@sf-express.com",
        contactPhone: "+86-95338",
        metadata: {
          code: "SF_EXPRESS",
          website: "https://www.sf-express.com",
          trackingUrl: "https://www.sf-express.com/en/dynamic_function/waybill",
          serviceTypes: ["Standard Express", "Economy", "Same Day", "International"],
          coverage: ["China", "Hong Kong", "Taiwan", "Global"],
          pricing: {
            baseRate: 5.99,
            currency: "CNY",
            perKgRate: 3.0,
          },
        },
      },
      {
        name: "Australia Post",
        description: "Australia's national postal service",
        contactEmail: "customer.service@auspost.com.au",
        contactPhone: "+61-13-7678",
        metadata: {
          code: "AUSTRALIA_POST",
          website: "https://auspost.com.au",
          trackingUrl: "https://auspost.com.au/mypost/track",
          serviceTypes: ["Express Post", "Parcel Post", "International", "StarTrack"],
          coverage: ["Australia", "International"],
          pricing: {
            baseRate: 10.95,
            currency: "AUD",
            perKgRate: 2.5,
          },
        },
      },
    ];

    console.log("🚚 Creating sample carriers...");
    for (const carrierData of sampleCarriers) {
      try {
        const carrier = await createCarrierUseCase.execute(carrierData);
        console.log(
          `✅ Created carrier: ${carrier.name} (${carrier.metadata?.code})`
        );
      } catch (error) {
        if (error.message && error.message.includes("Carrier name already exists")) {
          console.log(`⚠️  Carrier already exists: ${carrierData.name}`);
        } else {
          console.error(
            `❌ Error creating carrier ${carrierData.name}:`,
            error.message || error
          );
        }
      }
    }

    console.log(`📊 Sample carriers created successfully`);
    console.log("🎉 Carrier Service seeding completed successfully!");
  } catch (error) {
    console.error("❌ Error during seeding:", error);
  } finally {
    await app.close();
  }
}

// Run seeding
seedData().catch(console.error);
