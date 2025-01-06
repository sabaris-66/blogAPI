-- DropForeignKey
ALTER TABLE "BlogUserComment" DROP CONSTRAINT "BlogUserComment_postId_fkey";

-- DropForeignKey
ALTER TABLE "BlogUserComment" DROP CONSTRAINT "BlogUserComment_userId_fkey";

-- DropForeignKey
ALTER TABLE "BlogUserPost" DROP CONSTRAINT "BlogUserPost_authorId_fkey";

-- AlterTable
ALTER TABLE "BlogUserComment" ALTER COLUMN "userId" DROP NOT NULL,
ALTER COLUMN "postId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "BlogUserPost" ALTER COLUMN "authorId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "BlogUserPost" ADD CONSTRAINT "BlogUserPost_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "BlogUser"("username") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlogUserComment" ADD CONSTRAINT "BlogUserComment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "BlogUser"("username") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlogUserComment" ADD CONSTRAINT "BlogUserComment_postId_fkey" FOREIGN KEY ("postId") REFERENCES "BlogUserPost"("id") ON DELETE SET NULL ON UPDATE CASCADE;
