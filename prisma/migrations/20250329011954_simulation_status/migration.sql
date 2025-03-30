-- CreateEnum
CREATE TYPE "SimulationStatus" AS ENUM ('DRAFT', 'PENDING', 'RUNNING', 'COMPLETED', 'ERROR');

-- AlterTable
ALTER TABLE "simulations" ADD COLUMN     "status" "SimulationStatus" NOT NULL DEFAULT 'DRAFT';
