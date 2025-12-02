# Migration Plan: Local PostgreSQL Database Setup

## Overview
This document outlines the complete migration plan to set up a local PostgreSQL database for testing purposes using Docker and Knex.js migration tool.

## Objectives
- Set up a local PostgreSQL database using Docker
- Configure Knex.js as the migration tool
- Create a test migration to verify the setup
- Provide clear steps for running and managing migrations

---

## Prerequisites

### Required Software
- **Docker** and **Docker Compose** installed and running
- **Node.js** (v16 or higher) and **npm** installed
- Basic understanding of PostgreSQL and database migrations

### Verify Prerequisites
```bash
# Check Docker installation
docker --version
docker compose version

# Check Node.js installation
node --version
npm --version
```

---

## Step 1: Project Structure Setup

### Files Created/Modified

1. **`docker-compose.yml`**
   - Defines PostgreSQL service container
   - Database: `opin_local`
   - User: `opin_user`
   - Password: `opin_password`
   - Port: `5432`
   - Persistent volume for data storage

2. **`knexfile.cjs`**
   - Knex configuration file
   - Connection settings for local PostgreSQL
   - Migration directory: `./migrations`
   - Migration tracking table: `knex_migrations`

3. **`migrations/20251202_create_test_table.js`**
   - Test migration file
   - Creates `test_table` with columns: `id`, `name`, `created_at`
   - Includes `up` and `down` functions for migration and rollback

4. **`package.json`**
   - Added dependencies: `knex`, `pg`
   - Added scripts: `db:migrate`, `db:rollback`

---

## Step 2: Install Dependencies

### Command
```bash
npm install
```

### What This Does
- Installs `knex` (migration tool)
- Installs `pg` (PostgreSQL client for Node.js)
- Installs all other project dependencies

### Expected Output
- Dependencies installed in `node_modules/`
- `package-lock.json` updated

---

## Step 3: Start Local PostgreSQL Database

### Command
```bash
docker compose up -d
```

### What This Does
- Pulls PostgreSQL 16 Docker image (if not already present)
- Creates and starts the `opin_postgres` container
- Creates the `opin_local` database
- Sets up user credentials
- Exposes PostgreSQL on port `5432`

### Verify Database is Running
```bash
# Check container status
docker ps

# Check logs
docker compose logs postgres

# Test connection (optional)
docker compose exec postgres psql -U opin_user -d opin_local -c "SELECT version();"
```

### Expected Output
- Container should be running and healthy
- Database should be accessible on `localhost:5432`

---

## Step 4: Configure Environment Variables (Optional)

### Option A: Use Default Values
The `knexfile.cjs` uses default values:
- Host: `127.0.0.1`
- Port: `5432`
- User: `opin_user`
- Password: `opin_password`
- Database: `opin_local`

### Option B: Create `.env` File
Create a `.env` file in the project root:

```env
# Database Connection
DATABASE_URL=postgres://opin_user:opin_password@localhost:5432/opin_local

# OR use individual variables
DB_HOST=127.0.0.1
DB_PORT=5432
DB_USER=opin_user
DB_PASSWORD=opin_password
DB_NAME=opin_local
```

**Note:** Add `.env` to `.gitignore` if it contains sensitive information.

---

## Step 5: Run Migration

### Command
```bash
npm run db:migrate
```

### What This Does
- Connects to the local PostgreSQL database
- Checks the `knex_migrations` table for previously run migrations
- Executes any pending migrations (starting with `20251202_create_test_table.js`)
- Creates the `test_table` in the database
- Records the migration in `knex_migrations` table

### Expected Output
```
Using environment: development
Batch 1 run: 1 migrations
```

### Verify Migration Success
```bash
# Connect to database and check table
docker compose exec postgres psql -U opin_user -d opin_local -c "\dt"

# Check migration history
docker compose exec postgres psql -U opin_user -d opin_local -c "SELECT * FROM knex_migrations;"
```

### Expected Tables
- `knex_migrations` (tracks migration history)
- `test_table` (our test table with columns: id, name, created_at)

---

## Step 6: Verify Test Table

### Check Table Structure
```bash
docker compose exec postgres psql -U opin_user -d opin_local -c "\d test_table"
```

### Insert Test Data (Optional)
```bash
docker compose exec postgres psql -U opin_user -d opin_local -c "INSERT INTO test_table (name) VALUES ('Test Entry');"
```

### Query Test Data
```bash
docker compose exec postgres psql -U opin_user -d opin_local -c "SELECT * FROM test_table;"
```

---

## Step 7: Rollback Migration (If Needed)

### Command
```bash
npm run db:rollback
```

### What This Does
- Rolls back the last batch of migrations
- Drops the `test_table` if it was created by the last migration
- Removes the migration record from `knex_migrations`

### When to Use
- If you need to undo a migration
- If you want to test the rollback functionality
- If you made an error in a migration

---

## Step 8: Create New Migrations

### Command
```bash
npx knex migrate:make migration_name --knexfile knexfile.cjs
```

### What This Does
- Creates a new migration file in `migrations/` directory
- File name format: `YYYYMMDDHHMMSS_migration_name.js`
- Includes template `up` and `down` functions

### Example
```bash
npx knex migrate:make add_users_table --knexfile knexfile.cjs
```

This creates: `migrations/YYYYMMDDHHMMSS_add_users_table.js`

### Migration File Template
```javascript
/**
 * @param {import("knex").Knex} knex
 */
exports.up = async function up(knex) {
  // Write your migration code here
};

/**
 * @param {import("knex").Knex} knex
 */
exports.down = async function down(knex) {
  // Write your rollback code here
};
```

---

## Troubleshooting

### Issue: Docker container won't start
**Solution:**
```bash
# Check if port 5432 is already in use
sudo lsof -i :5432

# Stop existing PostgreSQL service (if any)
sudo systemctl stop postgresql

# Restart Docker
sudo systemctl restart docker
docker compose up -d
```

### Issue: Connection refused error
**Solution:**
- Verify Docker container is running: `docker ps`
- Check container logs: `docker compose logs postgres`
- Verify port 5432 is not blocked by firewall
- Ensure connection string matches docker-compose.yml settings

### Issue: Migration fails
**Solution:**
- Check database connection: `npm run db:migrate` with verbose output
- Verify `knexfile.cjs` has correct connection settings
- Check if migration file has syntax errors
- Ensure database user has proper permissions

### Issue: Migration already run error
**Solution:**
- Check migration status: Query `knex_migrations` table
- If needed, manually remove entry from `knex_migrations` table
- Or use rollback: `npm run db:rollback`

---

## Database Management Commands

### Stop Database
```bash
docker compose stop
```

### Start Database (if stopped)
```bash
docker compose start
```

### Remove Database (⚠️ Deletes all data)
```bash
docker compose down -v
```

### View Database Logs
```bash
docker compose logs -f postgres
```

### Access PostgreSQL CLI
```bash
docker compose exec postgres psql -U opin_user -d opin_local
```

### Backup Database
```bash
docker compose exec postgres pg_dump -U opin_user opin_local > backup.sql
```

### Restore Database
```bash
docker compose exec -T postgres psql -U opin_user opin_local < backup.sql
```

---

## Next Steps

1. **Create Production Migrations**
   - Design your actual database schema
   - Create migrations for each table/feature
   - Test migrations locally before deploying

2. **Integration with Application**
   - Update application code to connect to local database for development
   - Consider using environment variables to switch between local and production databases

3. **CI/CD Integration**
   - Add migration steps to your CI/CD pipeline
   - Ensure migrations run automatically on deployment

4. **Documentation**
   - Document your database schema
   - Keep migration files well-commented
   - Maintain a changelog of database changes

---

## Summary Checklist

- [ ] Docker and Docker Compose installed
- [ ] Dependencies installed (`npm install`)
- [ ] PostgreSQL container running (`docker compose up -d`)
- [ ] Database accessible on port 5432
- [ ] Migration executed successfully (`npm run db:migrate`)
- [ ] Test table created and verified
- [ ] Rollback tested (optional)
- [ ] Environment variables configured (if needed)

---

## Additional Resources

- [Knex.js Documentation](https://knexjs.org/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)

---

**Last Updated:** December 2, 2025
**Status:** Ready for implementation

