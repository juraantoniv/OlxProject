import { MigrationInterface, QueryRunner } from "typeorm";

export class  $npmConfigName1712757701201 implements MigrationInterface {
    name = ' $npmConfigName1712757701201'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Goods" ADD "favorite" text array`);
        await queryRunner.query(`ALTER TABLE "Goods" ALTER COLUMN "currency_type" SET DEFAULT 'UAH'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Goods" ALTER COLUMN "currency_type" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "Goods" DROP COLUMN "favorite"`);
    }

}
