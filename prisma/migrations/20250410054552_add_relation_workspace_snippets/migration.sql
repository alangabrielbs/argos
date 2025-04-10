/*
  Warnings:

  - Added the required column `workspace_id` to the `SnippetFolder` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SnippetFolder" ADD COLUMN     "workspace_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "SnippetFolder" ADD CONSTRAINT "SnippetFolder_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;
