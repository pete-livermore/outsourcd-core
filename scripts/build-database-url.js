const fs = require('fs');
const path = require('path');
require('dotenv').config();

const {
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  POSTGRES_HOST,
  POSTGRES_PORT,
  POSTGRES_DB,
} = process.env;

const DATABASE_URL = `postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}`;

const envFilePath = path.resolve(__dirname, '../.env');
let envFileContent = fs.readFileSync(envFilePath, 'utf8');

if (/^DATABASE_URL=/m.test(envFileContent)) {
  envFileContent = envFileContent.replace(
    /^DATABASE_URL=.*$/m,
    `DATABASE_URL=${DATABASE_URL}`,
  );
} else {
  envFileContent += `\nDATABASE_URL=${DATABASE_URL}`;
}

// Write the updated content back to the .env file
fs.writeFileSync(envFilePath, envFileContent, 'utf8');

console.log('DATABASE_URL has been updated in the .env file.');
