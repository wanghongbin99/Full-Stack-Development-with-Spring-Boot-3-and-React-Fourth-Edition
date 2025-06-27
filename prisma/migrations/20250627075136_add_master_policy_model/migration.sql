-- AlterTable
ALTER TABLE "policies" ADD COLUMN     "master_policy_id" TEXT;

-- CreateTable
CREATE TABLE "master_policies" (
    "id" TEXT NOT NULL,
    "master_policy_number" TEXT NOT NULL,
    "holder_id" TEXT NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "status" "PolicyStatus" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "master_policies_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "master_policies_master_policy_number_key" ON "master_policies"("master_policy_number");

-- AddForeignKey
ALTER TABLE "policies" ADD CONSTRAINT "policies_master_policy_id_fkey" FOREIGN KEY ("master_policy_id") REFERENCES "master_policies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "master_policies" ADD CONSTRAINT "master_policies_holder_id_fkey" FOREIGN KEY ("holder_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
