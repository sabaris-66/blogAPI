-- AlterTable
ALTER TABLE "BlogUserComment" ALTER COLUMN "comment" DROP NOT NULL;

-- AlterTable
ALTER TABLE "BlogUserPost" ALTER COLUMN "content" DROP NOT NULL;
