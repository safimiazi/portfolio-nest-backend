/*
  Warnings:

  - You are about to drop the column `description` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "description",
ADD COLUMN     "bio" TEXT,
ADD COLUMN     "githubLink" TEXT,
ADD COLUMN     "linkedinLink" TEXT,
ADD COLUMN     "photo" TEXT,
ADD COLUMN     "resumeLink" TEXT,
ADD COLUMN     "twitterLink" TEXT,
ADD COLUMN     "websiteLink" TEXT;
