set -e

echo "Running database migrations..."
npm run migrate

echo "Starting the application..."
exec node dist/main.js
