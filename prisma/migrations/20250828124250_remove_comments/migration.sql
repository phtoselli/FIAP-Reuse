-- AlterTable
ALTER TABLE "public"."Post" ADD COLUMN     "rating" DOUBLE PRECISION DEFAULT 0;

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "city" TEXT,
ADD COLUMN     "state" TEXT;
