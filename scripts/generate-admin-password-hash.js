const crypto = require('node:crypto');

const password = process.argv[2];

if (!password) {
  console.error('Usage: node scripts/generate-admin-password-hash.js <password>');
  process.exit(1);
}

const hash = crypto.createHash('sha256').update(password).digest('hex');
console.log(hash);
