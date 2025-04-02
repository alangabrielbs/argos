/*
  Warnings:

  - The `status` column on the `executions` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "ExecutionStatus" AS ENUM ('DRAFT', 'PENDING', 'RUNNING', 'COMPLETED', 'ERROR', 'CALCULATED', 'ERROR_WHILE_CALCULATING');

-- AlterTable
ALTER TABLE "executions" DROP COLUMN "status",
ADD COLUMN     "status" "ExecutionStatus" NOT NULL DEFAULT 'PENDING';

-- DropEnum
DROP TYPE "SimulationStatus";
