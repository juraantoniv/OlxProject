import { MigrationInterface, QueryRunner } from "typeorm";

export class  $npmConfigName1713170592060 implements MigrationInterface {
    name = ' $npmConfigName1713170592060'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."Goods_category_enum" RENAME TO "Goods_category_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."Goods_category_enum" AS ENUM('CARS', 'JOB', 'FASHION', 'PROPERTY', 'ELECTRONICS', 'FOODS', 'OTHER')`);
        await queryRunner.query(`ALTER TABLE "Goods" ALTER COLUMN "category" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "Goods" ALTER COLUMN "category" TYPE "public"."Goods_category_enum" USING "category"::"text"::"public"."Goods_category_enum"`);
        await queryRunner.query(`ALTER TABLE "Goods" ALTER COLUMN "category" SET DEFAULT 'OTHER'`);
        await queryRunner.query(`DROP TYPE "public"."Goods_category_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."Goods_category_enum_old" AS ENUM('CARS', 'JOB', 'FASHION', 'PROPERTY', 'ELECTRONICS', 'OTHER')`);
        await queryRunner.query(`ALTER TABLE "Goods" ALTER COLUMN "category" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "Goods" ALTER COLUMN "category" TYPE "public"."Goods_category_enum_old" USING "category"::"text"::"public"."Goods_category_enum_old"`);
        await queryRunner.query(`ALTER TABLE "Goods" ALTER COLUMN "category" SET DEFAULT 'OTHER'`);
        await queryRunner.query(`DROP TYPE "public"."Goods_category_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."Goods_category_enum_old" RENAME TO "Goods_category_enum"`);
    }

}
