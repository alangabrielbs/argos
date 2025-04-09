/*
  Warnings:

  - You are about to drop the column `result_formula` on the `executions` table. All the data in the column will be lost.
  - You are about to drop the column `formula_id` on the `simulations` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "simulations" DROP CONSTRAINT "simulations_formula_id_fkey";

-- AlterTable
ALTER TABLE "executions" DROP COLUMN "result_formula";

-- AlterTable
ALTER TABLE "simulations" DROP COLUMN "formula_id";

-- CreateTable
CREATE TABLE "FormulaExecution" (
    "id" TEXT NOT NULL,
    "formula_id" TEXT NOT NULL,
    "execution_id" TEXT NOT NULL,
    "result" DOUBLE PRECISION NOT NULL,
    "error" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ready_at" TIMESTAMP(3),

    CONSTRAINT "FormulaExecution_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "FormulaExecution" ADD CONSTRAINT "FormulaExecution_formula_id_fkey" FOREIGN KEY ("formula_id") REFERENCES "Formula"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormulaExecution" ADD CONSTRAINT "FormulaExecution_execution_id_fkey" FOREIGN KEY ("execution_id") REFERENCES "executions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
