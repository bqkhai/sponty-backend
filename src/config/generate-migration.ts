import { execSync } from 'child_process';
const customParam = process.argv[2];
const migrationScript = `typeorm migration:generate -d dist/config/data-source.js src/database/migrations/`;
try {
  execSync(`${migrationScript + customParam}`, { stdio: 'inherit' });
  console.log(`Migration '${customParam}' generated successfully.`);
} catch (error) {
  console.error(`Failed to generate or rename the migration: ${error.message}`);
}
