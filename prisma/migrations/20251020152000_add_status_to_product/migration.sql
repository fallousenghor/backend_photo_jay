-- Migration: add Product.status enum and migrate existing isApproved values
-- 1) Create enum type if not exists
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'productstatus') THEN
    CREATE TYPE "ProductStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');
  END IF;
END
$$;

-- 2) Add status column with default PENDING if not exists
ALTER TABLE "Product"
ADD COLUMN IF NOT EXISTS "status" "ProductStatus" NOT NULL DEFAULT 'PENDING';

-- 3) Migrate data from isApproved (if present)
--    true  -> 'APPROVED'
--    false -> 'PENDING'
UPDATE "Product"
SET "status" = 'APPROVED'
WHERE COALESCE("isApproved", false) = true;

-- 4) (Optional) drop isApproved column if you no longer need it
-- ALTER TABLE "Product" DROP COLUMN IF EXISTS "isApproved";
