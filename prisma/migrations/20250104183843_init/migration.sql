-- CreateTable
CREATE TABLE "BlogUserPost" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "content" TEXT NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "authorId" TEXT NOT NULL,

    CONSTRAINT "BlogUserPost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlogUserComment" (
    "id" SERIAL NOT NULL,
    "comment" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "postId" INTEGER NOT NULL,

    CONSTRAINT "BlogUserComment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlogUser" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "BlogUser_pkey" PRIMARY KEY ("username")
);

-- CreateIndex
CREATE UNIQUE INDEX "BlogUserComment_userId_key" ON "BlogUserComment"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "BlogUserComment_postId_key" ON "BlogUserComment"("postId");

-- CreateIndex
CREATE UNIQUE INDEX "BlogUser_email_key" ON "BlogUser"("email");

-- CreateIndex
CREATE UNIQUE INDEX "BlogUser_username_key" ON "BlogUser"("username");

-- AddForeignKey
ALTER TABLE "BlogUserPost" ADD CONSTRAINT "BlogUserPost_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "BlogUser"("username") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlogUserComment" ADD CONSTRAINT "BlogUserComment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "BlogUser"("username") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlogUserComment" ADD CONSTRAINT "BlogUserComment_postId_fkey" FOREIGN KEY ("postId") REFERENCES "BlogUserPost"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
