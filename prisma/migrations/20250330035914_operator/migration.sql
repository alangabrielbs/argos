-- AlterTable
ALTER TABLE "simulations" ADD COLUMN     "operator" TEXT,
ADD COLUMN     "operator_is_percentage" BOOLEAN,
ADD COLUMN     "operator_number" TEXT;
