/*
  Warnings:

  - You are about to drop the `Category` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Subcategory` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Post" DROP CONSTRAINT "Post_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Post" DROP CONSTRAINT "Post_conditionId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Post" DROP CONSTRAINT "Post_subcategoryId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Subcategory" DROP CONSTRAINT "Subcategory_category_id_fkey";

-- AlterTable
ALTER TABLE "public"."Proposal" ADD COLUMN     "shipping_address" TEXT,
ADD COLUMN     "shipping_method" TEXT;

-- AlterTable
ALTER TABLE "public"."ProposalItem" ADD COLUMN     "isOffered" BOOLEAN;

-- AlterTable
ALTER TABLE "public"."Trade" ADD COLUMN     "typeId" TEXT,
ADD COLUMN     "userId" TEXT;

-- DropTable
DROP TABLE "public"."Category";

-- DropTable
DROP TABLE "public"."Subcategory";

-- AddForeignKey
ALTER TABLE "public"."Trade" ADD CONSTRAINT "Trade_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Trade" ADD CONSTRAINT "Trade_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "public"."Type"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Proposal" ADD CONSTRAINT "Proposal_responderId_fkey" FOREIGN KEY ("responderId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
