/*
  Warnings:

  - You are about to alter the column `status` on the `user` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(1))` to `Enum(EnumId(1))`.

*/
-- AlterTable
ALTER TABLE `admin` ADD COLUMN `token` VARCHAR(191) NULL,
    MODIFY `phone` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `token` VARCHAR(191) NULL,
    MODIFY `status` ENUM('ACTIVE', 'LOCKED') NOT NULL DEFAULT 'ACTIVE';
