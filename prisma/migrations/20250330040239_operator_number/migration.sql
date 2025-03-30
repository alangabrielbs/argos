/*
  Warnings:

  - The `operator_number` column on the `simulations` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "simulations" DROP COLUMN "operator_number",
ADD COLUMN     "operator_number" INTEGER;
