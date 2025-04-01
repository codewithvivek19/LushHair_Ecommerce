// Simple script to test password hashing and comparison
const bcrypt = require('bcryptjs');

async function testHash() {
  const password = 'admin123';
  const hash = await bcrypt.hash(password, 10);
  console.log('Generated hash:', hash);
  
  // Verify the hash works
  const isMatch = await bcrypt.compare(password, hash);
  console.log('Hash verification:', isMatch);
  
  // Create a fixed hash for test user
  const fixedHash = '$2a$10$2MO.YUaJPRsMW4LZAiwJ7.2ZQd0PWv54e7S6ZD1O38fXcr7.ngcwC'; // hash for 'admin123'
  const isFixedMatch = await bcrypt.compare(password, fixedHash);
  console.log('Fixed hash verification:', isFixedMatch);
}

testHash().catch(console.error); 