// Direct password comparison test
const bcrypt = require('bcryptjs');

// Plain passwords
const password = 'admin123';

// Test creating a new hash
bcrypt.hash(password, 10)
  .then(hash => {
    console.log('New hash:', hash);
    
    // Test comparing password with the new hash
    return bcrypt.compare(password, hash);
  })
  .then(result => {
    console.log('Fresh hash comparison result:', result);
    
    // Test with our fixed hash from script
    const fixedHash = '$2a$10$2MO.YUaJPRsMW4LZAiwJ7.2ZQd0PWv54e7S6ZD1O38fXcr7.ngcwC';
    return bcrypt.compare(password, fixedHash);
  })
  .then(result => {
    console.log('Fixed hash comparison result:', result);
  })
  .catch(err => {
    console.error('Error:', err);
  }); 