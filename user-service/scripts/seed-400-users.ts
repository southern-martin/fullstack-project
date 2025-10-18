import { NestFactory } from "@nestjs/core";
import { AppModule } from "../src/app.module";
import { CreateUserUseCase } from "../src/application/use-cases/create-user.use-case";
import { CreateRoleUseCase } from "../src/application/use-cases/create-role.use-case";

// Faker library for generating realistic data
// If not installed: npm install --save-dev @faker-js/faker
// For now, we'll use manual data generation

async function seed400Users() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const createUserUseCase = app.get(CreateUserUseCase);
  const createRoleUseCase = app.get(CreateRoleUseCase);

  try {
    console.log("🌱 Starting bulk user seeding (400 users)...");
    console.log("⏰ This may take a few minutes...\n");

    // Ensure roles exist first
    console.log("📝 Ensuring roles exist...");
    const roles = [
      {
        name: "admin",
        description: "Administrator with full access",
        permissions: ["users.manage", "roles.manage", "system.admin"],
        isActive: true,
      },
      {
        name: "user",
        description: "Regular user with basic access",
        permissions: ["users.read", "profile.manage"],
        isActive: true,
      },
      {
        name: "moderator",
        description: "Moderator with limited admin access",
        permissions: ["users.read", "users.update", "content.moderate"],
        isActive: true,
      },
    ];

    for (const roleData of roles) {
      try {
        await createRoleUseCase.execute(roleData);
        console.log(`✅ Created role: ${roleData.name}`);
      } catch (error) {
        console.log(`⚠️  Role ${roleData.name} already exists`);
      }
    }

    // Sample data for realistic user generation
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
    ];

    // Helper functions
    const random = (array: any[]) => array[Math.floor(Math.random() * array.length)];
    const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
    const randomDate = (start: Date, end: Date) => {
      return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    };

    // Generate 400 users
    const totalUsers = 400;
    const batchSize = 50; // Process in batches for better performance
    let successCount = 0;
    let errorCount = 0;
    const startTime = Date.now();

    for (let i = 0; i < totalUsers; i += batchSize) {
      const currentBatch = Math.min(batchSize, totalUsers - i);
      const batchPromises = [];

      for (let j = 0; j < currentBatch; j++) {
        const userIndex = i + j + 1; // +1 to start from 1
        const firstName = random(firstNames);
        const lastName = random(lastNames);
        const domain = random(domains);
        
        // Create email with number to ensure uniqueness
        const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${userIndex}@${domain}`;
        
        // Randomize user status (80% active, 20% inactive)
        const isActive = Math.random() > 0.2;
        
        // Randomize email verification (70% verified, 30% not verified)
        const isEmailVerified = Math.random() > 0.3;
        
        // Assign roles: 5% admin, 10% moderator, 85% user
        let roleIds: number[];
        const roleRandom = Math.random();
        if (roleRandom < 0.05) {
          roleIds = [1]; // admin
        } else if (roleRandom < 0.15) {
          roleIds = [3]; // moderator
        } else {
          roleIds = [2]; // user
        }

        // Random date of birth (between 18 and 80 years ago)
        const eighteenYearsAgo = new Date();
        eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);
        const eightyYearsAgo = new Date();
        eightyYearsAgo.setFullYear(eightyYearsAgo.getFullYear() - 80);

        const userData = {
          email,
          password: "Password123!", // Default password for all test users (with special char)
          firstName,
          lastName,
          phone: `+1${randomInt(200, 999)}${randomInt(100, 999)}${randomInt(1000, 9999)}`,
          isActive,
          isEmailVerified,
          roleIds,
          dateOfBirth: randomDate(eightyYearsAgo, eighteenYearsAgo).toISOString().split('T')[0], // Convert to YYYY-MM-DD string
          address: Math.random() > 0.3 ? {
            street: `${randomInt(1, 9999)} ${random(lastNames)} Street`,
            city: random(cities),
            state: random(states),
            zipCode: String(randomInt(10000, 99999)),
            country: "USA",
          } : undefined,
          preferences: {
            theme: random(["light", "dark", "auto"]),
            language: random(["en", "es", "fr", "de"]),
            notifications: Math.random() > 0.5,
          },
        };

        batchPromises.push(
          createUserUseCase.execute(userData)
            .then(() => {
              successCount++;
              return true;
            })
            .catch((error: any) => {
              errorCount++;
              console.error(`❌ Failed to create user ${email}:`, error.message || error);
              if (error.errors) {
                console.error(`   Validation errors:`, JSON.stringify(error.errors, null, 2));
              }
              return false;
            })
        );
      }

      // Wait for current batch to complete
      await Promise.all(batchPromises);

      // Progress update
      const progress = Math.min(i + currentBatch, totalUsers);
      const percentage = Math.round((progress / totalUsers) * 100);
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
      console.log(`📊 Progress: ${progress}/${totalUsers} (${percentage}%) - ✅ ${successCount} success, ❌ ${errorCount} failed - ⏱️  ${elapsed}s`);
    }

    const totalTime = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log("\n" + "=".repeat(60));
    console.log("🎉 Bulk user seeding completed!");
    console.log("=".repeat(60));
    console.log(`📊 Summary:`);
    console.log(`   Total Users Requested: ${totalUsers}`);
    console.log(`   ✅ Successfully Created: ${successCount}`);
    console.log(`   ❌ Failed: ${errorCount}`);
    console.log(`   ⏱️  Total Time: ${totalTime}s`);
    console.log(`   ⚡ Average: ${(totalUsers / parseFloat(totalTime)).toFixed(2)} users/second`);
    console.log("=".repeat(60));
    console.log(`\n💡 Tips:`);
    console.log(`   - Default password for all users: Password123!`);
    console.log(`   - User distribution: 85% users, 10% moderators, 5% admins`);
    console.log("   - Status distribution: 80% active, 20% inactive");
    console.log("   - Test pagination with different page sizes (10, 25, 50, 100)");
    console.log("   - Try searching by name, email, or filtering by status");

  } catch (error) {
    console.error("❌ Fatal error during seeding:", error);
    throw error;
  } finally {
    await app.close();
  }
}

seed400Users();
