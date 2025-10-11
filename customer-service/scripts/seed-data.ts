import { NestFactory } from "@nestjs/core";
import { AppModule } from "../src/app.module";
import { CreateCustomerDto } from "../src/application/dto/create-customer.dto";
import { CustomerService } from "../src/application/services/customer.service";

async function seedData() {
  console.log("🌱 Starting Customer Service data seeding...");

  const app = await NestFactory.createApplicationContext(AppModule);
  const customerService = app.get(CustomerService);

  try {
    // Clear existing data
    console.log("🧹 Clearing existing customers...");
    // Note: In a real scenario, you might want to be more selective about clearing data

    // Create sample customers
    const sampleCustomers: CreateCustomerDto[] = [
      {
        email: "john.doe@example.com",
        firstName: "John",
        lastName: "Doe",
        phone: "+1234567890",
        dateOfBirth: "1990-01-15",
        address: {
          street: "123 Main St",
          city: "New York",
          state: "NY",
          zipCode: "10001",
          country: "USA",
        },
        preferences: {
          company: "Tech Corp",
          industry: "Technology",
          preferredContact: "email",
          newsletter: true,
        },
      },
      {
        email: "jane.smith@example.com",
        firstName: "Jane",
        lastName: "Smith",
        phone: "+1234567891",
        dateOfBirth: "1985-05-20",
        address: {
          street: "456 Oak Ave",
          city: "Los Angeles",
          state: "CA",
          zipCode: "90210",
          country: "USA",
        },
        preferences: {
          company: "Design Studio",
          industry: "Design",
          preferredContact: "phone",
          newsletter: false,
        },
      },
      {
        email: "bob.wilson@example.com",
        firstName: "Bob",
        lastName: "Wilson",
        phone: "+1234567892",
        dateOfBirth: "1992-12-10",
        address: {
          street: "789 Pine Rd",
          city: "Chicago",
          state: "IL",
          zipCode: "60601",
          country: "USA",
        },
        preferences: {
          company: "Finance Inc",
          industry: "Finance",
          preferredContact: "email",
          newsletter: true,
        },
      },
    ];

    console.log("👥 Creating sample customers...");
    for (const customerData of sampleCustomers) {
      try {
        const customer = await customerService.create(customerData);
        console.log(
          `✅ Created customer: ${customer.firstName} ${customer.lastName} (${customer.email})`
        );
      } catch (error) {
        if (error.message.includes("Email already exists")) {
          console.log(`⚠️  Customer already exists: ${customerData.email}`);
        } else {
          console.error(
            `❌ Error creating customer ${customerData.email}:`,
            error.message
          );
        }
      }
    }

    // Get total count
    const count = await customerService.getCount();
    console.log(`📊 Total customers in database: ${count.count}`);

    console.log("🎉 Customer Service seeding completed successfully!");
  } catch (error) {
    console.error("❌ Error during seeding:", error);
  } finally {
    await app.close();
  }
}

// Run seeding
seedData().catch(console.error);







