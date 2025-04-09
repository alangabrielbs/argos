-- DropForeignKey
ALTER TABLE "FormulaExecution" DROP CONSTRAINT "FormulaExecution_execution_id_fkey";

-- DropForeignKey
ALTER TABLE "FormulaExecution" DROP CONSTRAINT "FormulaExecution_formula_id_fkey";

-- AddForeignKey
ALTER TABLE "FormulaExecution" ADD CONSTRAINT "FormulaExecution_formula_id_fkey" FOREIGN KEY ("formula_id") REFERENCES "Formula"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormulaExecution" ADD CONSTRAINT "FormulaExecution_execution_id_fkey" FOREIGN KEY ("execution_id") REFERENCES "executions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
