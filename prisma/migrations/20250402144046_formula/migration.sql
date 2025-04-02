/*
  Warnings:

  - You are about to drop the column `disputed_value` on the `simulations` table. All the data in the column will be lost.
  - You are about to drop the column `ifood_felivery` on the `simulations` table. All the data in the column will be lost.
  - You are about to drop the column `loss_value` on the `simulations` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `simulations` table. All the data in the column will be lost.
  - You are about to drop the column `total_order_value` on the `simulations` table. All the data in the column will be lost.
  - You are about to drop the column `total_orders` on the `simulations` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "simulations" DROP COLUMN "disputed_value",
DROP COLUMN "ifood_felivery",
DROP COLUMN "loss_value",
DROP COLUMN "status",
DROP COLUMN "total_order_value",
DROP COLUMN "total_orders",
ADD COLUMN     "formula_id" TEXT;

-- CreateTable
CREATE TABLE "executions" (
    "id" TEXT NOT NULL,
    "status" "SimulationStatus" NOT NULL DEFAULT 'PENDING',
    "error" TEXT,
    "current" BOOLEAN DEFAULT true,
    "filters" JSONB,
    "values" JSONB,
    "result_formula" TEXT,
    "ready_state_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "simulation_id" TEXT,

    CONSTRAINT "executions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Formula" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "expression" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Formula_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Variable" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "key" TEXT NOT NULL,
    "example_value" DOUBLE PRECISION,
    "formula_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Variable_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Variable_formula_id_name_key" ON "Variable"("formula_id", "name");

-- AddForeignKey
ALTER TABLE "simulations" ADD CONSTRAINT "simulations_formula_id_fkey" FOREIGN KEY ("formula_id") REFERENCES "Formula"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "executions" ADD CONSTRAINT "executions_simulation_id_fkey" FOREIGN KEY ("simulation_id") REFERENCES "simulations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Variable" ADD CONSTRAINT "Variable_formula_id_fkey" FOREIGN KEY ("formula_id") REFERENCES "Formula"("id") ON DELETE CASCADE ON UPDATE CASCADE;
