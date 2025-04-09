/*
  Warnings:

  - You are about to drop the column `filters` on the `executions` table. All the data in the column will be lost.
  - You are about to drop the column `data_source` on the `simulations` table. All the data in the column will be lost.
  - You are about to drop the column `end_date` on the `simulations` table. All the data in the column will be lost.
  - You are about to drop the column `operator` on the `simulations` table. All the data in the column will be lost.
  - You are about to drop the column `operator_is_percentage` on the `simulations` table. All the data in the column will be lost.
  - You are about to drop the column `operator_number` on the `simulations` table. All the data in the column will be lost.
  - You are about to drop the column `start_date` on the `simulations` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "executions" DROP COLUMN "filters",
ADD COLUMN     "query" TEXT;

-- AlterTable
ALTER TABLE "simulations" DROP COLUMN "data_source",
DROP COLUMN "end_date",
DROP COLUMN "operator",
DROP COLUMN "operator_is_percentage",
DROP COLUMN "operator_number",
DROP COLUMN "start_date";

-- DropEnum
DROP TYPE "DataSource";
