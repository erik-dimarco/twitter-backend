/*
  Warnings:

  - You are about to drop the column `text` on the `tweets` table. All the data in the column will be lost.
  - Added the required column `caption` to the `tweets` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "tweets" DROP COLUMN "text",
ADD COLUMN     "caption" VARCHAR(280) NOT NULL;
