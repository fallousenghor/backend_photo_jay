/*
  Warnings:

  - Added the required column `publicId` to the `ProductImage` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
-- D'abord, ajouter la colonne comme NULL
ALTER TABLE "ProductImage" ADD COLUMN "publicId" TEXT;

-- Mettre à jour les enregistrements existants avec une valeur temporaire
UPDATE "ProductImage" SET "publicId" = 'legacy_' || id::text;

-- Ensuite, rendre la colonne NOT NULL
ALTER TABLE "ProductImage" ALTER COLUMN "publicId" SET NOT NULL;
