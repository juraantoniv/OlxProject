import { MigrationInterface, QueryRunner } from "typeorm";

export class  $npmConfigName1712943782974 implements MigrationInterface {
    name = ' $npmConfigName1712943782974'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."Goods_category_enum" AS ENUM('CARS', 'JOB', 'FASHION', 'PROPERTY', 'ELECTRONICS', 'OTHER')`);
        await queryRunner.query(`ALTER TABLE "Goods" ADD "category" "public"."Goods_category_enum" NOT NULL DEFAULT 'OTHER'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Goods" DROP COLUMN "category"`);
        await queryRunner.query(`DROP TYPE "public"."Goods_category_enum"`);
    }

}
