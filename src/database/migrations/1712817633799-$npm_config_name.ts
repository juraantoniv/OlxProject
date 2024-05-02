import { MigrationInterface, QueryRunner } from "typeorm";

export class  $npmConfigName1712817633799 implements MigrationInterface {
    name = ' $npmConfigName1712817633799'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Goods" ALTER COLUMN "favorite" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "Goods" ALTER COLUMN "favorite" SET DEFAULT '{}'`);
        await queryRunner.query(`ALTER TABLE "Goods" DROP COLUMN "price"`);
        await queryRunner.query(`ALTER TABLE "Goods" ADD "price" text NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Goods" DROP COLUMN "price"`);
        await queryRunner.query(`ALTER TABLE "Goods" ADD "price" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "Goods" ALTER COLUMN "favorite" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "Goods" ALTER COLUMN "favorite" DROP NOT NULL`);
    }

}
