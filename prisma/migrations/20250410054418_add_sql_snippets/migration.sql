-- CreateTable
CREATE TABLE "SqlSnippet" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "code" TEXT NOT NULL,
    "documentation" TEXT,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "folder_id" TEXT,

    CONSTRAINT "SqlSnippet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SnippetFolder" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "parent_id" TEXT,

    CONSTRAINT "SnippetFolder_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SqlSnippet" ADD CONSTRAINT "SqlSnippet_folder_id_fkey" FOREIGN KEY ("folder_id") REFERENCES "SnippetFolder"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SnippetFolder" ADD CONSTRAINT "SnippetFolder_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "SnippetFolder"("id") ON DELETE SET NULL ON UPDATE CASCADE;
