/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `workspaces` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `end_date` to the `simulations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `start_date` to the `simulations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `workspaces` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `workspaces` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "DataSource" AS ENUM ('DATABRICKS', 'SIMULATION');

-- AlterTable
ALTER TABLE "simulations" ADD COLUMN     "data_source" "DataSource" NOT NULL DEFAULT 'DATABRICKS',
ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "disputed_value" DOUBLE PRECISION,
ADD COLUMN     "end_date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "ifood_felivery" BOOLEAN,
ADD COLUMN     "loss_value" DOUBLE PRECISION,
ADD COLUMN     "start_date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "total_order_value" DOUBLE PRECISION,
ADD COLUMN     "total_orders" INTEGER;

-- AlterTable
ALTER TABLE "workspaces" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "description" TEXT,
ADD COLUMN     "slug" TEXT NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "workspaces_slug_key" ON "workspaces"("slug");
