// Simple test to verify validation logic
const { validate } = require('class-validator');
const { plainToClass } = require('class-transformer');

// Simple DTO class for testing
class CreateUserDto {
  constructor(data) {
    this.email = data.email;
    this.password = data.password;
    this.firstName = data.firstName;
    this.lastName = data.lastName;
  }
}

async function testValidation() {
  console.log('Testing validation with empty fields...');
  
  const emptyData = {
    email: '',
    password: '',
    firstName: '',
    lastName: ''
  };
  
  const dto = plainToClass(CreateUserDto, emptyData);
  const errors = await validate(dto);
  
  if (errors.length > 0) {
    console.log('✅ Validation working correctly!');
    console.log('Errors found:', errors.length);
    errors.forEach(error => {
      console.log(`- ${error.property}: ${Object.values(error.constraints).join(', ')}`);
    });
  } else {
    console.log('❌ Validation failed - no errors found for empty fields');
  }
}

testValidation().catch(console.error);
