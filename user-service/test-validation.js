const axios = require('axios');

async function testValidation() {
  try {
    console.log('Testing user creation with empty fields...');
    
    const response = await axios.post('http://localhost:3003/api/v1/users', {
      firstName: '',
      lastName: '',
      email: '',
      password: ''
    });
    
    console.log('❌ Validation failed - request succeeded when it should have failed');
    console.log('Response:', response.data);
  } catch (error) {
    if (error.response) {
      console.log('✅ Validation working correctly!');
      console.log('Status:', error.response.status);
      console.log('Response:', error.response.data);
    } else {
      console.log('❌ Network error:', error.message);
    }
  }
}

testValidation();
