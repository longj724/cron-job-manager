-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Jobs" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "file_path" TEXT NOT NULL,
    "cron_expression" TEXT NOT NULL,
    "text_cron_expression" TEXT NOT NULL
);
INSERT INTO "new_Jobs" ("created_at", "cron_expression", "file_path", "id", "name", "text_cron_expression") SELECT "created_at", "cron_expression", "file_path", "id", "name", "text_cron_expression" FROM "Jobs";
DROP TABLE "Jobs";
ALTER TABLE "new_Jobs" RENAME TO "Jobs";
CREATE UNIQUE INDEX "Jobs_name_key" ON "Jobs"("name");
CREATE UNIQUE INDEX "Jobs_file_path_key" ON "Jobs"("file_path");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
