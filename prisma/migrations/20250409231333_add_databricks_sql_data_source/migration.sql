/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Variable` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Variable` table. All the data in the column will be lost.
  - Added the required column `updated_at` to the `Variable` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Variable" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "DatabricksSQLDataSource" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "hostname" TEXT NOT NULL,
    "http_path" TEXT NOT NULL,
    "catalog" TEXT NOT NULL DEFAULT '',
    "schema" TEXT NOT NULL DEFAULT '',
    "notes" TEXT,
    "structure" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_connection" TIMESTAMP(3),
    "conn_error" TEXT,
    "is_default" BOOLEAN NOT NULL DEFAULT false,
    "workspace_id" TEXT NOT NULL,

    CONSTRAINT "DatabricksSQLDataSource_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "DatabricksSQLDataSource" ADD CONSTRAINT "DatabricksSQLDataSource_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;
