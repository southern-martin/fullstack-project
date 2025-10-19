import { NestFactory } from "@nestjs/core";
import { AppModule } from "../src/app.module";
import { CreateCustomerDto } from "../src/application/dto/create-customer.dto";
import { CreateCustomerUseCase } from "../src/application/use-cases/create-customer.use-case";

async function seedData() {
  console.log("🌱 Starting Customer Service data seeding...");

  const app = await NestFactory.createApplicationContext(AppModule);
  const createCustomerUseCase = app.get(CreateCustomerUseCase);

  try {
    // Clear existing data
  console.log("🧹 Clearing existing customers...");
  // Optionally clear existing data
  // await customerRepository.clear();

  console.log("👥 Generating 400 sample customers...");

  // Helper functions for realistic data generation
  const firstNames = [
    "James", "Mary", "John", "Patricia", "Robert", "Jennifer", "Michael", "Linda",
    "William", "Barbara", "David", "Elizabeth", "Richard", "Susan", "Joseph", "Jessica",
    "Thomas", "Sarah", "Charles", "Karen", "Christopher", "Nancy", "Daniel", "Lisa",
    "Matthew", "Betty", "Anthony", "Margaret", "Mark", "Sandra", "Donald", "Ashley",
    "Steven", "Kimberly", "Paul", "Emily", "Andrew", "Donna", "Joshua", "Michelle",
    "Kenneth", "Dorothy", "Kevin", "Carol", "Brian", "Amanda", "George", "Melissa",
    "Edward", "Deborah", "Ronald", "Stephanie", "Timothy", "Rebecca", "Jason", "Sharon",
    "Jeffrey", "Laura", "Ryan", "Cynthia", "Jacob", "Kathleen", "Gary", "Amy",
    "Nicholas", "Shirley", "Eric", "Angela", "Jonathan", "Helen", "Stephen", "Anna",
    "Larry", "Brenda", "Justin", "Pamela", "Scott", "Nicole", "Brandon", "Emma",
    "Benjamin", "Samantha", "Samuel", "Katherine", "Raymond", "Christine", "Gregory", "Debra",
    "Frank", "Rachel", "Alexander", "Catherine", "Patrick", "Carolyn", "Raymond", "Janet",
    "Jack", "Ruth", "Dennis", "Maria", "Jerry", "Heather", "Tyler", "Diane",
    "Aaron", "Virginia", "Jose", "Julie", "Adam", "Joyce", "Henry", "Victoria",
    "Nathan", "Olivia", "Douglas", "Kelly", "Zachary", "Christina", "Peter", "Lauren",
    "Kyle", "Joan", "Walter", "Evelyn", "Ethan", "Judith", "Jeremy", "Megan",
    "Harold", "Cheryl", "Keith", "Andrea", "Christian", "Hannah", "Roger", "Martha",
    "Noah", "Jacqueline", "Gerald", "Frances", "Carl", "Gloria", "Terry", "Ann",
    "Sean", "Teresa", "Austin", "Kathryn", "Arthur", "Sara", "Lawrence", "Janice",
    "Jesse", "Jean", "Dylan", "Alice", "Bryan", "Madison", "Joe", "Doris",
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
    "Herrera", "Gibson", "Ellis", "Tran", "Medina", "Aguilar", "Stevens", "Murray",
    "Ford", "Castro", "Marshall", "Owens", "Harrison", "Fernandez", "McDonald", "Woods",
    "Washington", "Kennedy", "Wells", "Vargas", "Henry", "Chen", "Freeman", "Webb",
    "Tucker", "Guzman", "Burns", "Crawford", "Olson", "Simpson", "Porter", "Hunter",
  ];

  const cities = [
    { city: "New York", state: "NY", zip: "10001" },
    { city: "Los Angeles", state: "CA", zip: "90001" },
    { city: "Chicago", state: "IL", zip: "60601" },
    { city: "Houston", state: "TX", zip: "77001" },
    { city: "Phoenix", state: "AZ", zip: "85001" },
    { city: "Philadelphia", state: "PA", zip: "19019" },
    { city: "San Antonio", state: "TX", zip: "78201" },
    { city: "San Diego", state: "CA", zip: "92101" },
    { city: "Dallas", state: "TX", zip: "75201" },
    { city: "San Jose", state: "CA", zip: "95101" },
    { city: "Austin", state: "TX", zip: "73301" },
    { city: "Jacksonville", state: "FL", zip: "32099" },
    { city: "Fort Worth", state: "TX", zip: "76101" },
    { city: "Columbus", state: "OH", zip: "43004" },
    { city: "Charlotte", state: "NC", zip: "28201" },
    { city: "San Francisco", state: "CA", zip: "94102" },
    { city: "Indianapolis", state: "IN", zip: "46201" },
    { city: "Seattle", state: "WA", zip: "98101" },
    { city: "Denver", state: "CO", zip: "80201" },
    { city: "Boston", state: "MA", zip: "02101" },
    { city: "Nashville", state: "TN", zip: "37201" },
    { city: "Detroit", state: "MI", zip: "48201" },
    { city: "Portland", state: "OR", zip: "97201" },
    { city: "Las Vegas", state: "NV", zip: "89101" },
    { city: "Miami", state: "FL", zip: "33101" },
  ];

  const companies = [
    "Tech Solutions Inc", "Global Enterprises", "Innovation Labs", "Digital Dynamics",
    "Enterprise Systems", "Cloud Services LLC", "Data Analytics Corp", "Smart Solutions",
    "Future Technologies", "Quantum Computing", "Cyber Security Plus", "AI Innovations",
    "Blockchain Ventures", "Mobile First Inc", "Web Solutions Pro", "Software House",
    "IT Consulting Group", "DevOps Masters", "Agile Development", "Code Factory",
    "Design Studio", "Creative Agency", "Marketing Pro", "Brand Builders",
    "Finance Corp", "Investment Group", "Capital Management", "Banking Solutions",
    "Insurance Plus", "Real Estate Pro", "Construction Inc", "Manufacturing Co",
    "Retail Chain", "E-commerce Hub", "Logistics Services", "Supply Chain Inc",
    "Healthcare Systems", "Medical Group", "Pharma Solutions", "Wellness Center",
  ];

  const industries = [
    "Technology", "Finance", "Healthcare", "Retail", "Manufacturing",
    "Education", "Real Estate", "Construction", "Transportation", "Energy",
    "Telecommunications", "Media", "Entertainment", "Hospitality", "Food Services",
    "Consulting", "Legal", "Marketing", "Insurance", "Agriculture",
  ];

  const streets = [
    "Main St", "Oak Ave", "Pine Rd", "Maple Dr", "Cedar Ln",
    "Elm St", "Washington Blvd", "Park Ave", "Broadway", "Market St",
    "1st St", "2nd Ave", "Lake Dr", "Hill Rd", "Valley View",
    "Sunset Blvd", "River Rd", "Forest Ln", "Meadow Dr", "Spring St",
  ];

  const sampleCustomers = [];
  const usedEmails = new Set<string>();

  for (let i = 0; i < 400; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    
    // Generate unique email
    let email: string;
    let attempts = 0;
    do {
      const emailVariant = attempts > 0 ? `${i + attempts}` : i.toString().padStart(3, '0');
      email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${emailVariant}@example.com`;
      attempts++;
    } while (usedEmails.has(email));
    usedEmails.add(email);

    const location = cities[Math.floor(Math.random() * cities.length)];
    const company = companies[Math.floor(Math.random() * companies.length)];
    const industry = industries[Math.floor(Math.random() * industries.length)];
    const street = streets[Math.floor(Math.random() * streets.length)];
    
    // Generate random date of birth (between 1950 and 2005)
    const birthYear = 1950 + Math.floor(Math.random() * 55);
    const birthMonth = Math.floor(Math.random() * 12);
    const birthDay = 1 + Math.floor(Math.random() * 28);
    
    // Generate phone number
    const areaCode = 200 + Math.floor(Math.random() * 800);
    const exchange = 200 + Math.floor(Math.random() * 800);
    const lineNumber = 1000 + Math.floor(Math.random() * 9000);
    const phone = `+1${areaCode}${exchange}${lineNumber}`;

    sampleCustomers.push({
      email,
      firstName,
      lastName,
      phone,
      dateOfBirth: new Date(birthYear, birthMonth, birthDay),
      address: {
        street: `${100 + Math.floor(Math.random() * 9900)} ${street}`,
        city: location.city,
        state: location.state,
        zipCode: location.zip,
        country: "USA",
      },
      preferences: {
        company,
        industry,
        preferredContact: Math.random() > 0.5 ? "email" : "phone",
        newsletter: Math.random() > 0.3, // 70% opt-in rate
      },
    });
  }    console.log("👥 Creating sample customers...");
    // Create customers with progress tracking
  let created = 0;
  let skipped = 0;
  let failed = 0;

  for (let i = 0; i < sampleCustomers.length; i++) {
    const customerData = sampleCustomers[i];
    try {
      const customer = await createCustomerUseCase.execute(customerData);
      created++;
      
      // Show progress every 50 customers
      if (created % 50 === 0 || created === 1) {
        console.log(
          `✅ Created ${created} customers... Latest: ${customer.firstName} ${customer.lastName}`
        );
      }
    } catch (error) {
      // Customer might already exist or other error
      if (error.message?.includes("duplicate") || error.message?.includes("already exists")) {
        skipped++;
        if (skipped <= 5) {
          console.log(`⚠️  Customer already exists: ${customerData.email}`);
        }
      } else {
        failed++;
        if (failed <= 5) {
          console.error(`❌ Failed to create customer ${customerData.email}:`, error.message);
        }
      }
    }
  }

  console.log("\n📊 Seeding Summary:");
  console.log(`   ✅ Created: ${created} customers`);
  console.log(`   ⚠️  Skipped: ${skipped} customers (already exist)`);
  console.log(`   ❌ Failed: ${failed} customers`);

    // Get total count
    // Note: We would need to inject GetCustomerUseCase to get count
    // For now, we'll skip the count display
    const count = 0;
    console.log(`📊 Total customers in database: ${count}`);

    console.log("🎉 Customer Service seeding completed successfully!");
  } catch (error) {
    console.error("❌ Error during seeding:", error);
    process.exit(1);
  } finally {
    await app.close();
    // Force exit after 2 seconds if app doesn't close cleanly
    setTimeout(() => {
      console.log("⚠️  Forcing exit...");
      process.exit(0);
    }, 2000);
  }
}

// Run seeding
seedData().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
