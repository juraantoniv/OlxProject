import { MigrationInterface, QueryRunner } from "typeorm";

export class  $npmConfigName1713302303801 implements MigrationInterface {
    name = ' $npmConfigName1713302303801'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."Goods_category_enum" RENAME TO "Goods_category_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."Goods_category_enum" AS ENUM('CARS', 'JOB', 'FASHION', 'PROPERTY', 'ELECTRONICS', 'FOODS', 'OTHER', 'HOME')`);
        await queryRunner.query(`ALTER TABLE "Goods" ALTER COLUMN "category" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "Goods" ALTER COLUMN "category" TYPE "public"."Goods_category_enum" USING "category"::"text"::"public"."Goods_category_enum"`);
        await queryRunner.query(`ALTER TABLE "Goods" ALTER COLUMN "category" SET DEFAULT 'OTHER'`);
        await queryRunner.query(`DROP TYPE "public"."Goods_category_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."Goods_category_enum_old" AS ENUM('CARS', 'JOB', 'FASHION', 'PROPERTY', 'ELECTRONICS', 'FOODS', 'OTHER')`);
        await queryRunner.query(`ALTER TABLE "Goods" ALTER COLUMN "category" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "Goods" ALTER COLUMN "category" TYPE "public"."Goods_category_enum_old" USING "category"::"text"::"public"."Goods_category_enum_old"`);
        await queryRunner.query(`ALTER TABLE "Goods" ALTER COLUMN "category" SET DEFAULT 'OTHER'`);
        await queryRunner.query(`DROP TYPE "public"."Goods_category_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."Goods_category_enum_old" RENAME TO "Goods_category_enum"`);
    }

}
