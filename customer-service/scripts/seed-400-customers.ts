import { NestFactory } from "@nestjs/core";
import { AppModule } from "../src/app.module";
import { CreateCustomerUseCase } from "../src/application/use-cases/create-customer.use-case";
import { CreateCustomerDto } from "../src/application/dto/create-customer.dto";

/**
 * Seed 400 Customers Script
 * Generates realistic customer data for testing and development
 * 
 * Usage:
 *   npm run seed:customers:400
 *   or
 *   ts-node scripts/seed-400-customers.ts
 */

async function seed400Customers() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const createCustomerUseCase = app.get(CreateCustomerUseCase);

  try {
    console.log("🌱 Starting bulk customer seeding (400 customers)...");
    console.log("⏰ This may take a few minutes...\n");

    // Sample data for realistic customer generation
    const firstNames = [
      "James", "Mary", "John", "Patricia", "Robert", "Jennifer", "Michael", "Linda",
      "William", "Elizabeth", "David", "Barbara", "Richard", "Susan", "Joseph", "Jessica",
      "Thomas", "Sarah", "Christopher", "Karen", "Charles", "Nancy", "Daniel", "Lisa",
      "Matthew", "Betty", "Anthony", "Margaret", "Mark", "Sandra", "Donald", "Ashley",
      "Steven", "Kimberly", "Paul", "Emily", "Andrew", "Donna", "Joshua", "Michelle",
      "Kenneth", "Carol", "Kevin", "Amanda", "Brian", "Dorothy", "George", "Melissa",
      "Timothy", "Deborah", "Ronald", "Stephanie", "Edward", "Rebecca", "Jason", "Sharon",
      "Jeffrey", "Laura", "Ryan", "Cynthia", "Jacob", "Kathleen", "Gary", "Amy",
      "Nicholas", "Angela", "Eric", "Shirley", "Jonathan", "Anna", "Stephen", "Brenda",
      "Larry", "Pamela", "Justin", "Emma", "Scott", "Nicole", "Brandon", "Helen",
      "Benjamin", "Samantha", "Samuel", "Katherine", "Raymond", "Christine", "Gregory", "Debra",
      "Alexander", "Rachel", "Patrick", "Carolyn", "Frank", "Janet", "Jack", "Catherine",
      "Dennis", "Maria", "Jerry", "Heather", "Tyler", "Diane", "Aaron", "Ruth",
      "Jose", "Julie", "Adam", "Olivia", "Nathan", "Joyce", "Henry", "Virginia",
      "Douglas", "Victoria", "Zachary", "Kelly", "Peter", "Lauren", "Kyle", "Christina",
      "Noah", "Joan", "Ethan", "Evelyn", "Jeremy", "Judith", "Walter", "Megan",
      "Christian", "Andrea", "Keith", "Cheryl", "Roger", "Hannah", "Terry", "Jacqueline",
      "Austin", "Martha", "Sean", "Madison", "Gerald", "Teresa", "Carl", "Gloria",
    ];

    const lastNames = [
      "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis",
      "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas",
      "Taylor", "Moore", "Jackson", "Martin", "Lee", "Perez", "Thompson", "White",
      "Harris", "Sanchez", "Clark", "Ramirez", "Lewis", "Robinson", "Walker", "Young",
      "Allen", "King", "Wright", "Scott", "Torres", "Nguyen", "Hill", "Flores",
      "Green", "Adams", "Nelson", "Baker", "Hall", "Rivera", "Campbell", "Mitchell",
      "Carter", "Roberts", "Gomez", "Phillips", "Evans", "Turner", "Diaz", "Parker",
      "Cruz", "Edwards", "Collins", "Reyes", "Stewart", "Morris", "Morales", "Murphy",
      "Cook", "Rogers", "Gutierrez", "Ortiz", "Morgan", "Cooper", "Peterson", "Bailey",
      "Reed", "Kelly", "Howard", "Ramos", "Kim", "Cox", "Ward", "Richardson",
      "Watson", "Brooks", "Chavez", "Wood", "James", "Bennett", "Gray", "Mendoza",
      "Ruiz", "Hughes", "Price", "Alvarez", "Castillo", "Sanders", "Patel", "Myers",
      "Long", "Ross", "Foster", "Jimenez", "Powell", "Jenkins", "Perry", "Russell",
      "Sullivan", "Bell", "Coleman", "Butler", "Henderson", "Barnes", "Gonzales", "Fisher",
      "Vasquez", "Simmons", "Romero", "Jordan", "Patterson", "Alexander", "Hamilton", "Graham",
      "Reynolds", "Griffin", "Wallace", "Moreno", "West", "Cole", "Hayes", "Bryant",
    ];

    const streetPrefixes = [
      "Main", "Oak", "Pine", "Maple", "Cedar", "Elm", "Washington", "Lake", "Hill", "Park",
      "River", "Sunset", "Spring", "Forest", "Meadow", "Church", "School", "State", "Broad", "Market",
      "Water", "Union", "South", "North", "West", "East", "Center", "Cherry", "Walnut", "Chestnut",
      "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th", "10th", "1st",
    ];

    const streetSuffixes = ["St", "Ave", "Rd", "Blvd", "Dr", "Ln", "Way", "Ct", "Pl", "Cir"];

    const cities = [
      "New York", "Los Angeles", "Chicago", "Houston", "Phoenix", "Philadelphia", "San Antonio",
      "San Diego", "Dallas", "San Jose", "Austin", "Jacksonville", "Fort Worth", "Columbus",
      "Charlotte", "San Francisco", "Indianapolis", "Seattle", "Denver", "Boston", "Nashville",
      "Detroit", "Portland", "Las Vegas", "Memphis", "Louisville", "Baltimore", "Milwaukee",
      "Albuquerque", "Tucson", "Fresno", "Sacramento", "Kansas City", "Atlanta", "Miami",
      "Oakland", "Tulsa", "Minneapolis", "Cleveland", "Wichita", "Arlington", "Tampa",
      "New Orleans", "Bakersfield", "Honolulu", "Aurora", "Anaheim", "Santa Ana", "Riverside",
      "Corpus Christi", "Lexington", "Stockton", "Pittsburgh", "Anchorage", "Cincinnati",
    ];

    const states = [
      "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
      "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
      "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
      "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
      "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY",
    ];

    const domains = [
      "gmail.com", "yahoo.com", "outlook.com", "hotmail.com", "icloud.com",
      "protonmail.com", "aol.com", "mail.com", "zoho.com", "fastmail.com",
      "live.com", "me.com", "msn.com", "yandex.com", "gmx.com",
    ];

    const companies = [
      "Tech Corp", "Design Studio", "Finance Inc", "Marketing Pro", "Consulting Group",
      "Retail Solutions", "Manufacturing Co", "Healthcare Systems", "Education Partners", "Real Estate LLC",
      "Construction Works", "Legal Services", "Accounting Firm", "Insurance Agency", "Travel Agency",
      "Food Service", "Entertainment Inc", "Media Group", "Publishing House", "Software Dev",
      "Cloud Services", "Data Analytics", "Security Systems", "Logistics Co", "Transportation Inc",
      "Energy Solutions", "Environmental Services", "Biotech Labs", "Pharma Corp", "Research Institute",
    ];

    const industries = [
      "Technology", "Finance", "Healthcare", "Education", "Retail", "Manufacturing",
      "Consulting", "Marketing", "Real Estate", "Construction", "Legal", "Accounting",
      "Insurance", "Transportation", "Hospitality", "Entertainment", "Media", "Publishing",
      "Software", "Telecommunications", "Energy", "Environmental", "Biotechnology", "Pharmaceuticals",
      "Agriculture", "Automotive", "Aviation", "E-commerce", "Fashion", "Food & Beverage",
    ];

    const contactPreferences = ["email", "phone", "sms"];

    // Helper functions
    const random = <T>(array: T[]): T => array[Math.floor(Math.random() * array.length)];
    const randomInt = (min: number, max: number): number => 
      Math.floor(Math.random() * (max - min + 1)) + min;
    
    const randomDate = (start: Date, end: Date): string => {
      const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
      return date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
    };

    const randomPhone = (): string => {
      const areaCode = randomInt(200, 999);
      const prefix = randomInt(200, 999);
      const lineNumber = randomInt(1000, 9999);
      return `+1${areaCode}${prefix}${lineNumber}`;
    };

    const randomZipCode = (): string => {
      return String(randomInt(10000, 99999));
    };

    // Generate 400 customers
    const totalCustomers = 400;
    const batchSize = 50; // Process in batches for better performance
    let successCount = 0;
    let errorCount = 0;
    const startTime = Date.now();

    console.log(`📊 Generating ${totalCustomers} customers in batches of ${batchSize}...\n`);

    for (let i = 0; i < totalCustomers; i += batchSize) {
      const currentBatch = Math.min(batchSize, totalCustomers - i);
      const batchNumber = Math.floor(i / batchSize) + 1;
      const totalBatches = Math.ceil(totalCustomers / batchSize);
      
      console.log(`🔄 Processing batch ${batchNumber}/${totalBatches} (${currentBatch} customers)...`);
      
      const batchPromises = [];

      for (let j = 0; j < currentBatch; j++) {
        const customerIndex = i + j + 1; // +1 to start from 1
        const firstName = random(firstNames);
        const lastName = random(lastNames);
        const domain = random(domains);
        
        // Create email with number to ensure uniqueness
        const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${customerIndex}@${domain}`;
        
        // Randomize customer status (85% active, 15% inactive)
        const isActive = Math.random() > 0.15;
        
        // Generate random date of birth (between 18 and 80 years old)
        const minAge = new Date();
        minAge.setFullYear(minAge.getFullYear() - 80);
        const maxAge = new Date();
        maxAge.setFullYear(maxAge.getFullYear() - 18);
        const dateOfBirth = randomDate(minAge, maxAge);
        
        // Generate random address
        const streetNumber = randomInt(1, 9999);
        const streetPrefix = random(streetPrefixes);
        const streetSuffix = random(streetSuffixes);
        const street = `${streetNumber} ${streetPrefix} ${streetSuffix}`;
        const city = random(cities);
        const state = random(states);
        const zipCode = randomZipCode();
        
        // Generate preferences (80% have company info)
        const hasCompanyInfo = Math.random() > 0.2;
        const preferences = hasCompanyInfo ? {
          company: random(companies),
          industry: random(industries),
          preferredContact: random(contactPreferences),
          newsletter: Math.random() > 0.5, // 50% subscribed to newsletter
        } : {
          preferredContact: random(contactPreferences),
          newsletter: Math.random() > 0.5,
        };

        // 90% have phone numbers
        const phone = Math.random() > 0.1 ? randomPhone() : undefined;

        const customerData: CreateCustomerDto = {
          email,
          firstName,
          lastName,
          phone,
          dateOfBirth,
          address: {
            street,
            city,
            state,
            zipCode,
            country: "USA",
          },
          preferences,
        };

        // Create customer
        const promise = createCustomerUseCase
          .execute(customerData)
          .then((customer) => {
            successCount++;
            if (customerIndex % 100 === 0) {
              console.log(`  ✅ Created customer ${customerIndex}: ${customer.firstName} ${customer.lastName}`);
            }
          })
          .catch((error) => {
            errorCount++;
            if (error.message?.includes("Email already exists") || error.message?.includes("duplicate")) {
              // Silent duplicate - this is expected in re-runs
            } else {
              console.error(`  ❌ Error creating customer ${customerIndex} (${email}):`, error.message);
            }
          });

        batchPromises.push(promise);
      }

      // Wait for current batch to complete before moving to next
      await Promise.all(batchPromises);
      
      const progress = Math.round(((i + currentBatch) / totalCustomers) * 100);
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
      console.log(`  📈 Progress: ${i + currentBatch}/${totalCustomers} (${progress}%) - ${elapsed}s elapsed\n`);
    }

    const totalTime = ((Date.now() - startTime) / 1000).toFixed(2);
    const avgTime = (parseFloat(totalTime) / successCount * 1000).toFixed(0);

    console.log("\n" + "=".repeat(60));
    console.log("📊 SEEDING SUMMARY");
    console.log("=".repeat(60));
    console.log(`✅ Successfully created: ${successCount} customers`);
    console.log(`❌ Errors/Duplicates: ${errorCount}`);
    console.log(`⏱️  Total time: ${totalTime}s`);
    console.log(`⚡ Average time per customer: ${avgTime}ms`);
    console.log(`🎯 Success rate: ${((successCount / totalCustomers) * 100).toFixed(1)}%`);
    console.log("=".repeat(60));

    if (successCount > 0) {
      console.log("\n🎉 Customer seeding completed successfully!");
      console.log(`\n💡 Tip: You can verify the data at http://localhost:3004/api/v1/customers`);
    } else {
      console.log("\n⚠️  No customers were created. They may already exist in the database.");
    }

  } catch (error) {
    console.error("\n❌ Fatal error during seeding:", error);
    process.exit(1);
  } finally {
    await app.close();
  }
}

// Run seeding
seed400Customers().catch((error) => {
  console.error("❌ Unhandled error:", error);
  process.exit(1);
});
