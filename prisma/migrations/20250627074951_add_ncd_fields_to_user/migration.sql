-- AlterTable
ALTER TABLE "users" ADD COLUMN     "last_claim_date" TIMESTAMP(3),
ADD COLUMN     "ncd_years" INTEGER NOT NULL DEFAULT 0;
