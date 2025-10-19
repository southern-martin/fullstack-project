import { NestFactory } from "@nestjs/core";

// Use dynamic import to handle both dev and production environments
let AppModule: any;
let CreateCarrierUseCase: any;
let CreateCarrierDto: any;

// Check if we're in production (dist exists) or development (src exists)
try {
  // Try production path first
  const prodModules = require("../dist/carrier-service/src/app.module");
  const prodUseCase = require("../dist/carrier-service/src/application/use-cases/create-carrier.use-case");
  AppModule = prodModules.AppModule;
  CreateCarrierUseCase = prodUseCase.CreateCarrierUseCase;
} catch {
  // Fall back to development path
  const devModules = require("../src/app.module");
  const devUseCase = require("../src/application/use-cases/create-carrier.use-case");
  AppModule = devModules.AppModule;
  CreateCarrierUseCase = devUseCase.CreateCarrierUseCase;
}

interface CreateCarrierDto {
  name: string;
  description: string;
  contactEmail: string;
  contactPhone: string;
  metadata?: any;
}

async function seedData() {
  console.log("🌱 Starting Carrier Service data seeding...");

  const app = await NestFactory.createApplicationContext(AppModule);
  const createCarrierUseCase = app.get(CreateCarrierUseCase);

  try {
    // Clear existing data
    console.log("🧹 Clearing existing carriers...");
    // Note: In a real scenario, you might want to be more selective about clearing data

    // Create sample carriers - Most common carriers worldwide
    const sampleCarriers: CreateCarrierDto[] = [
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
        name: "TNT Express",
        description: "Express delivery services worldwide (FedEx subsidiary)",
        contactEmail: "support@tnt.com",
        contactPhone: "+44-800-100-600",
        metadata: {
          code: "TNT",
          website: "https://www.tnt.com",
          trackingUrl: "https://www.tnt.com/express/en_us/site/tracking.html",
          serviceTypes: ["Express", "Economy", "Special Services"],
          coverage: ["Europe", "Asia", "Americas", "200+ Countries"],
          pricing: {
            baseRate: 16.99,
            currency: "USD",
            perKgRate: 2.75,
          },
        },
      },

      // E-commerce Focused Carriers
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
        name: "OnTrac",
        description: "Regional carrier serving Western US with fast ground delivery",
        contactEmail: "customerservice@ontrac.com",
        contactPhone: "+1-800-334-5000",
        metadata: {
          code: "ONTRAC",
          website: "https://www.ontrac.com",
          trackingUrl: "https://www.ontrac.com/tracking/",
          serviceTypes: ["Ground", "Sunrise", "Same Day"],
          coverage: ["Western US", "Arizona", "California", "Colorado", "Nevada", "Oregon", "Washington"],
          pricing: {
            baseRate: 6.99,
            currency: "USD",
            perKgRate: 1.25,
          },
        },
      },
      {
        name: "LaserShip",
        description: "Regional carrier for e-commerce deliveries in Eastern US",
        contactEmail: "info@lasership.com",
        contactPhone: "+1-888-527-3774",
        metadata: {
          code: "LASERSHIP",
          website: "https://www.lasership.com",
          trackingUrl: "https://www.lasership.com/track",
          serviceTypes: ["Next Day", "2-Day", "Weekend Delivery"],
          coverage: ["Eastern US", "Mid-Atlantic", "Northeast", "Southeast"],
          pricing: {
            baseRate: 5.99,
            currency: "USD",
            perKgRate: 1.15,
          },
        },
      },

      // Canadian Carriers
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
        name: "Purolator",
        description: "Leading Canadian courier service",
        contactEmail: "customerservice@purolator.com",
        contactPhone: "+1-888-744-7123",
        metadata: {
          code: "PUROLATOR",
          website: "https://www.purolator.com",
          trackingUrl: "https://www.purolator.com/en/ship-track/tracking.page",
          serviceTypes: ["Express", "Ground", "Freight", "International"],
          coverage: ["Canada", "US"],
          pricing: {
            baseRate: 14.99,
            currency: "CAD",
            perKgRate: 2.25,
          },
        },
      },

      // European Carriers
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
        name: "Hermes (Evri)",
        description: "Major UK parcel delivery company",
        contactEmail: "help@evri.com",
        contactPhone: "+44-330-808-5456",
        metadata: {
          code: "HERMES",
          website: "https://www.evri.com",
          trackingUrl: "https://www.evri.com/track-a-parcel",
          serviceTypes: ["Standard", "Next Day", "ParcelShop"],
          coverage: ["UK", "Europe"],
          pricing: {
            baseRate: 2.99,
            currency: "GBP",
            perKgRate: 0.85,
          },
        },
      },
      {
        name: "DPD",
        description: "Leading European parcel delivery network",
        contactEmail: "customer.services@dpd.co.uk",
        contactPhone: "+44-121-275-0500",
        metadata: {
          code: "DPD",
          website: "https://www.dpd.com",
          trackingUrl: "https://www.dpd.co.uk/tracking",
          serviceTypes: ["Next Day", "Two Day", "Saturday Delivery", "International"],
          coverage: ["UK", "Europe", "230+ Countries"],
          pricing: {
            baseRate: 5.99,
            currency: "GBP",
            perKgRate: 1.25,
          },
        },
      },
      {
        name: "GLS",
        description: "General Logistics Systems - pan-European parcel services",
        contactEmail: "info@gls-group.eu",
        contactPhone: "+49-6677-646-0",
        metadata: {
          code: "GLS",
          website: "https://gls-group.eu",
          trackingUrl: "https://gls-group.eu/track",
          serviceTypes: ["Express", "Standard", "ShopDelivery", "FlexDelivery"],
          coverage: ["Europe", "40+ Countries"],
          pricing: {
            baseRate: 6.99,
            currency: "EUR",
            perKgRate: 1.5,
          },
        },
      },

      // Asian Carriers
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
        name: "Yamato Transport",
        description: "Japan's largest door-to-door delivery service",
        contactEmail: "info@kuronekoyamato.co.jp",
        contactPhone: "+81-3-3541-3411",
        metadata: {
          code: "YAMATO",
          website: "https://www.kuronekoyamato.co.jp",
          trackingUrl: "https://toi.kuronekoyamato.co.jp/cgi-bin/tneko",
          serviceTypes: ["TA-Q-BIN", "Cool TA-Q-BIN", "Time Service", "International"],
          coverage: ["Japan", "International"],
          pricing: {
            baseRate: 800,
            currency: "JPY",
            perKgRate: 150,
          },
        },
      },
      {
        name: "Japan Post",
        description: "Japan's national postal service",
        contactEmail: "service@post.japanpost.jp",
        contactPhone: "+81-3-3477-0111",
        metadata: {
          code: "JAPAN_POST",
          website: "https://www.post.japanpost.jp",
          trackingUrl: "https://trackings.post.japanpost.jp/services/srv/search/",
          serviceTypes: ["EMS", "Airmail", "SAL", "Surface Mail"],
          coverage: ["Japan", "International"],
          pricing: {
            baseRate: 600,
            currency: "JPY",
            perKgRate: 120,
          },
        },
      },
      {
        name: "Korea Post",
        description: "South Korea's national postal service",
        contactEmail: "help@koreapost.go.kr",
        contactPhone: "+82-1588-1300",
        metadata: {
          code: "KOREA_POST",
          website: "https://www.koreapost.go.kr",
          trackingUrl: "https://service.epost.go.kr/trace.RetrieveDomRigiTraceList.comm",
          serviceTypes: ["EMS", "K-Packet", "Parcel Post", "Express Mail"],
          coverage: ["South Korea", "International"],
          pricing: {
            baseRate: 3500,
            currency: "KRW",
            perKgRate: 500,
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

      // Latin American Carriers
      {
        name: "Correios Brazil",
        description: "Brazilian national postal service",
        contactEmail: "faleconosco@correios.com.br",
        contactPhone: "+55-3003-0100",
        metadata: {
          code: "CORREIOS",
          website: "https://www.correios.com.br",
          trackingUrl: "https://www.correios.com.br/rastreamento",
          serviceTypes: ["SEDEX", "PAC", "International", "Express"],
          coverage: ["Brazil", "International"],
          pricing: {
            baseRate: 15.0,
            currency: "BRL",
            perKgRate: 3.5,
          },
        },
      },

      // Freight Carriers
      {
        name: "XPO Logistics",
        description: "Less-than-truckload freight shipping",
        contactEmail: "customer.service@xpo.com",
        contactPhone: "+1-800-344-3278",
        metadata: {
          code: "XPO",
          website: "https://www.xpo.com",
          trackingUrl: "https://www.xpo.com/track-shipment",
          serviceTypes: ["LTL", "Truckload", "Expedited", "Guaranteed"],
          coverage: ["US", "Canada", "Mexico", "Europe"],
          pricing: {
            baseRate: 125.0,
            currency: "USD",
            perKgRate: 0.25,
          },
        },
      },
      {
        name: "Old Dominion Freight Line",
        description: "Premier less-than-truckload carrier",
        contactEmail: "customerservice@odfl.com",
        contactPhone: "+1-800-432-6335",
        metadata: {
          code: "ODFL",
          website: "https://www.odfl.com",
          trackingUrl: "https://www.odfl.com/Trace/standardResult.faces",
          serviceTypes: ["LTL", "Volume", "Expedited", "International"],
          coverage: ["US", "Canada", "Mexico", "Caribbean"],
          pricing: {
            baseRate: 150.0,
            currency: "USD",
            perKgRate: 0.3,
          },
        },
      },

      // Specialty Carriers
      {
        name: "Pitney Bowes",
        description: "Technology-enabled shipping and mailing solutions",
        contactEmail: "support@pb.com",
        contactPhone: "+1-877-536-2736",
        metadata: {
          code: "PITNEY_BOWES",
          website: "https://www.pitneybowes.com",
          trackingUrl: "https://www.pitneybowes.com/us/shipping-tracking.html",
          serviceTypes: ["Domestic", "International", "Parcel", "Mail"],
          coverage: ["US", "International"],
          pricing: {
            baseRate: 4.99,
            currency: "USD",
            perKgRate: 0.95,
          },
        },
      },
      {
        name: "FedEx Ground",
        description: "Reliable, economical ground shipping",
        contactEmail: "ground@fedex.com",
        contactPhone: "+1-800-463-3339",
        metadata: {
          code: "FEDEX_GROUND",
          website: "https://www.fedex.com/en-us/shipping/ground.html",
          trackingUrl: "https://www.fedex.com/fedextrack",
          serviceTypes: ["Home Delivery", "Business", "SmartPost"],
          coverage: ["US", "Canada", "Puerto Rico"],
          pricing: {
            baseRate: 9.99,
            currency: "USD",
            perKgRate: 1.75,
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
      } catch (error: any) {
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

    // Get total count (placeholder - would need to implement count use case)
    console.log(`📊 Sample carriers created successfully`);

    console.log("🎉 Carrier Service seeding completed successfully!");
  } catch (error: any) {
    console.error("❌ Error during seeding:", error);
  } finally {
    await app.close();
  }
}

// Run seeding
seedData().catch(console.error);
