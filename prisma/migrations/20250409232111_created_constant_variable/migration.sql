-- AlterTable
ALTER TABLE "Variable" ADD COLUMN     "is_constant" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "value" DOUBLE PRECISION;
