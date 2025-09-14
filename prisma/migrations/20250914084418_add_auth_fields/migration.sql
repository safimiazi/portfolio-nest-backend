-- CreateTable
CREATE TABLE "public"."User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "designation" TEXT,
    "description" TEXT,
    "education" TEXT,
    "otp" TEXT,
    "university" TEXT,
    "universityStart" TEXT,
    "universityEnd" TEXT,
    "gpa" TEXT,
    "location" TEXT,
    "phone" TEXT,
    "experience" TEXT,
    "changePasswordAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Project" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "images" TEXT[],
    "usedTechnologies" TEXT[],
    "title" TEXT,
    "liveLink" TEXT,
    "githubFrontendLink" TEXT,
    "githubBackendLink" TEXT,
    "shortDesc" TEXT,
    "detailsDesc" TEXT,
    "status" TEXT,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- AddForeignKey
ALTER TABLE "public"."Project" ADD CONSTRAINT "Project_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
