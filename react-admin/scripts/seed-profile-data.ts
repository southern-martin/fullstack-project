/**
 * Seed Script for User Profile Test Data
 * 
 * This script creates or updates user profiles with sample data
 * to test the profile functionality in the browser.
 */

export {};

interface ProfileAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface SocialLinks {
  linkedin?: string;
  github?: string;
  twitter?: string;
  website?: string;
}

interface ProfileData {
  dateOfBirth: string;
  bio: string;
  avatar: string;
  address: ProfileAddress;
  socialLinks: SocialLinks;
  preferences: Record<string, any>;
  metadata: Record<string, any>;
}

const USER_SERVICE_URL = 'http://localhost:3003/api/v1';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

// Sample bios for variety
const sampleBios = [
  'Experienced software engineer and system administrator with 10+ years in full-stack development. Passionate about clean code, microservices architecture, and building scalable applications.',
  'Product manager with a focus on user experience and agile methodologies. Love working with cross-functional teams to deliver innovative solutions.',
  'Frontend developer specializing in React, TypeScript, and modern web technologies. Building beautiful and performant user interfaces.',
  'Backend engineer with expertise in Node.js, Python, and distributed systems. Focused on building robust and scalable APIs.',
  'DevOps specialist passionate about automation, CI/CD, and cloud infrastructure. Experience with AWS, Docker, and Kubernetes.',
  'UI/UX designer with a passion for creating intuitive and accessible user experiences. Skilled in Figma, Adobe XD, and user research.',
  'Data scientist with expertise in machine learning and statistical analysis. Building predictive models and data-driven solutions.',
  'Mobile developer focused on React Native and cross-platform development. Creating seamless mobile experiences.',
  'Quality assurance engineer dedicated to ensuring software quality through comprehensive testing strategies and automation.',
  'Technical writer and documentation specialist. Creating clear, concise, and helpful documentation for developers and end-users.'
];

// Sample cities and states
const locations = [
  { city: 'San Francisco', state: 'CA', zipCode: '94102' },
  { city: 'New York', state: 'NY', zipCode: '10001' },
  { city: 'Austin', state: 'TX', zipCode: '78701' },
  { city: 'Seattle', state: 'WA', zipCode: '98101' },
  { city: 'Boston', state: 'MA', zipCode: '02101' },
  { city: 'Chicago', state: 'IL', zipCode: '60601' },
  { city: 'Denver', state: 'CO', zipCode: '80201' },
  { city: 'Portland', state: 'OR', zipCode: '97201' },
  { city: 'Atlanta', state: 'GA', zipCode: '30301' },
  { city: 'Miami', state: 'FL', zipCode: '33101' }
];

// Avatar background colors
const avatarColors = [
  '3b82f6', '10b981', '8b5cf6', 'f59e0b', 'ef4444',
  '06b6d4', 'ec4899', '6366f1', '14b8a6', 'f97316'
];

// Departments
const departments = ['Engineering', 'Product', 'Design', 'Marketing', 'Sales', 'Operations', 'HR', 'Finance'];

// Generate random date of birth (between 25-50 years old)
function getRandomDateOfBirth(): string {
  const now = new Date();
  const year = now.getFullYear() - Math.floor(Math.random() * 26) - 25; // 25-50 years old
  const month = Math.floor(Math.random() * 12) + 1;
  const day = Math.floor(Math.random() * 28) + 1;
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

// Generate profile data for a user
function generateProfileData(user: User, index: number): ProfileData {
  const location = locations[index % locations.length];
  const colorIndex = index % avatarColors.length;
  const bio = sampleBios[index % sampleBios.length];
  const fullName = `${user.firstName}+${user.lastName}`;
  const username = user.email.split('@')[0].toLowerCase();
  
  return {
    dateOfBirth: getRandomDateOfBirth(),
    bio,
    avatar: `https://ui-avatars.com/api/?name=${fullName}&size=200&background=${avatarColors[colorIndex]}&color=fff`,
    address: {
      street: `${100 + index} ${['Main', 'Tech', 'Innovation', 'Developer', 'Digital'][index % 5]} ${['Street', 'Boulevard', 'Avenue', 'Drive', 'Lane'][index % 5]}`,
      city: location.city,
      state: location.state,
      zipCode: location.zipCode,
      country: 'United States'
    },
    socialLinks: {
      ...(index % 3 === 0 ? { linkedin: `https://linkedin.com/in/${username}` } : {}),
      ...(index % 2 === 0 ? { github: `https://github.com/${username}` } : {}),
      ...(index % 4 === 0 ? { twitter: `https://twitter.com/${username}` } : {}),
      ...(index % 5 === 0 ? { website: `https://${username}.dev` } : {})
    },
    preferences: {
      theme: index % 2 === 0 ? 'dark' : 'light',
      language: 'en',
      notifications: index % 3 === 0
    },
    metadata: {
      department: departments[index % departments.length],
      employeeId: `EMP-${String(user.id).padStart(3, '0')}`,
      ...(index % 4 === 0 ? { startDate: '2020-01-15' } : {})
    }
  };
}

// Fetch all users from the API with pagination
async function fetchAllUsers(): Promise<User[]> {
  const allUsers: User[] = [];
  let page = 1;
  const limit = 100; // Fetch 100 users per page
  let hasMore = true;

  try {
    while (hasMore) {
      const response = await fetch(`${USER_SERVICE_URL}/users?page=${page}&limit=${limit}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch users: ${response.status}`);
      }
      const data = await response.json();
      
      // Handle different response structures
      let users: User[] = [];
      if (data?.data?.users && Array.isArray(data.data.users)) {
        users = data.data.users;
      } else if (data?.data?.data && Array.isArray(data.data.data)) {
        users = data.data.data;
      } else if (data?.data && Array.isArray(data.data)) {
        users = data.data;
      } else if (Array.isArray(data)) {
        users = data;
      }

      if (users.length > 0) {
        allUsers.push(...users);
        console.log(`   Fetched page ${page}: ${users.length} users (Total: ${allUsers.length})`);
        page++;
        
        // If we got fewer users than the limit, we've reached the end
        if (users.length < limit) {
          hasMore = false;
        }
      } else {
        hasMore = false;
      }
    }

    return allUsers;
  } catch (error) {
    console.error('Error fetching users:', error);
    return allUsers; // Return what we've fetched so far
  }
}

// Create or update a profile
async function createOrUpdateProfile(
  userId: number,
  profileData: ProfileData
): Promise<string> {
  try {
    // Try to update first (PATCH)
    const updateResponse = await fetch(`${USER_SERVICE_URL}/profiles/${userId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profileData),
    });

    if (updateResponse.ok) {
      return 'updated';
    }

    // If update failed with 404 or 500, try to create (POST)
    if (updateResponse.status === 404 || updateResponse.status === 500) {
      const createResponse = await fetch(`${USER_SERVICE_URL}/profiles/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });

      if (createResponse.ok) {
        return 'created';
      } else {
        const errorText = await createResponse.text();
        console.error(`❌ Failed to create profile for user ${userId}: ${createResponse.status} ${errorText}`);
        return 'error';
      }
    } else {
      const errorText = await updateResponse.text();
      console.error(`❌ Failed to update profile for user ${userId}: ${updateResponse.status} ${errorText}`);
      return 'error';
    }
  } catch (error) {
    console.error(`❌ Error seeding profile for user ${userId}:`, error);
    return 'error';
  }
}

// Main seeding function
async function seedProfileData() {
  console.log('🌱 Starting User Profile Data Seeding...');
  console.log('� Fetching all users from the database...\n');

  const users = await fetchAllUsers();
  
  if (users.length === 0) {
    console.error('❌ No users found in the database. Please ensure users exist first.');
    return;
  }

  console.log(`📊 Found ${users.length} users. Generating profiles...\n`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  let created = 0;
  let updated = 0;
  let errors = 0;
  const startTime = Date.now();

  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    const profileData = generateProfileData(user, i);

    // Show progress every 10 users
    if ((i + 1) % 10 === 0 || i === 0) {
      const progress = ((i + 1) / users.length * 100).toFixed(1);
      console.log(`\n📊 Progress: ${i + 1}/${users.length} (${progress}%)`);
    }

    console.log(`📝 User ${user.id} (${user.firstName} ${user.lastName})...`);

    const result = await createOrUpdateProfile(user.id, profileData);

    if (result === 'created') {
      created++;
    } else if (result === 'updated') {
      updated++;
    } else {
      errors++;
    }

    // Add a small delay between requests to avoid overwhelming the server
    // Reduced delay for large batches
    await new Promise(resolve => setTimeout(resolve, 50));
  }

  const endTime = Date.now();
  const duration = ((endTime - startTime) / 1000).toFixed(2);

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('✅ Profile Data Seeding Complete!');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📊 Summary:');
  console.log(`   - Users processed: ${users.length}`);
  console.log(`   - Profiles created: ${created}`);
  console.log(`   - Profiles updated: ${updated}`);
  console.log(`   - Errors: ${errors}`);
  console.log(`   - Duration: ${duration} seconds`);
  console.log(`   - Average: ${(users.length / parseFloat(duration)).toFixed(1)} profiles/second`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('\n💡 Next steps:');
  console.log('   1. Open the browser and go to Users page');
  console.log('   2. Click "View Details" on any user');
  console.log('   3. Navigate to the "Profile" tab');
  console.log('   4. You should see the profile with all data populated');
  console.log('   5. Test with different users to see varied profile data');
}

// Run the seeding
seedProfileData().catch(console.error);
