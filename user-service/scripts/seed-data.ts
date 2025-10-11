import { NestFactory } from "@nestjs/core";
import { AppModule } from "../src/app.module";
import { RoleService } from "../src/application/services/role.service";
import { UserService } from "../src/application/services/user.service";

async function seedData() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const userService = app.get(UserService);
  const roleService = app.get(RoleService);

  try {
    console.log("🌱 Starting data seeding...");

    // Create default roles
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

    console.log("📝 Creating roles...");
    for (const roleData of roles) {
      try {
        await roleService.create(roleData);
        console.log(`✅ Created role: ${roleData.name}`);
      } catch (error) {
        console.log(`⚠️  Role ${roleData.name} already exists`);
      }
    }

    // Create test users
    const users = [
      {
        email: "admin@example.com",
        password: "Admin123",
        firstName: "Admin",
        lastName: "User",
        phone: "+1234567890",
        isActive: true,
        isEmailVerified: true,
        roleIds: [1], // admin role
      },
      {
        email: "user@example.com",
        password: "User123",
        firstName: "Regular",
        lastName: "User",
        phone: "+1234567891",
        isActive: true,
        isEmailVerified: true,
        roleIds: [2], // user role
      },
      {
        email: "moderator@example.com",
        password: "Moderator123",
        firstName: "Moderator",
        lastName: "User",
        phone: "+1234567892",
        isActive: true,
        isEmailVerified: true,
        roleIds: [3], // moderator role
      },
    ];

    console.log("👥 Creating users...");
    for (const userData of users) {
      try {
        await userService.create(userData);
        console.log(`✅ Created user: ${userData.email}`);
      } catch (error) {
        console.log(`⚠️  User ${userData.email} already exists`);
      }
    }

    console.log("🎉 Data seeding completed successfully!");
  } catch (error) {
    console.error("❌ Error during seeding:", error);
  } finally {
    await app.close();
  }
}

seedData();




