-- SQL script to remove the "A escola possui PPP próprio?" column from escolas_completa table
-- 
-- IMPORTANT: Backup your database before running this script!
-- 
-- This script removes the column "A escola possui PPP próprio?" from the escolas_completa table.
-- The column has been removed from the application code, so this SQL will clean up the database.

-- For PostgreSQL/Supabase:
ALTER TABLE escolas_completa 
DROP COLUMN IF EXISTS "A escola possui PPP próprio?";

-- Note: If you're using a different database system, you may need to adjust the syntax:
-- 
-- MySQL:
-- ALTER TABLE escolas_completa DROP COLUMN IF EXISTS `A escola possui PPP próprio?`;
-- 
-- SQL Server:
-- ALTER TABLE escolas_completa DROP COLUMN IF EXISTS [A escola possui PPP próprio?];

