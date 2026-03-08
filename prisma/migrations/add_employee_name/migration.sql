-- AlterTable
ALTER TABLE "Employee" ADD COLUMN "name" TEXT NOT NULL DEFAULT '';

-- Update existing records to have a default name based on email
UPDATE "Employee" SET "name" = SPLIT_PART(email, '@', 1) WHERE "name" = '';
