import { MigrationInterface, QueryRunner } from "typeorm";

export class  $npmConfigName1713177790490 implements MigrationInterface {
    name = ' $npmConfigName1713177790490'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Goods" DROP COLUMN "price"`);
        await queryRunner.query(`ALTER TABLE "Goods" ADD "price" integer NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Goods" DROP COLUMN "price"`);
        await queryRunner.query(`ALTER TABLE "Goods" ADD "price" text NOT NULL`);
    }

}
