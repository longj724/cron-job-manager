-- CreateTable
CREATE TABLE "Jobs" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL,
    "file_path" TEXT NOT NULL,
    "cron_expression" TEXT NOT NULL,
    "text_cron_expression" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Jobs_name_key" ON "Jobs"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Jobs_file_path_key" ON "Jobs"("file_path");
