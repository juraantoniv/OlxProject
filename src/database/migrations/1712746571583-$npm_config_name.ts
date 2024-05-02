import { MigrationInterface, QueryRunner } from "typeorm";

export class  $npmConfigName1712746571583 implements MigrationInterface {
    name = ' $npmConfigName1712746571583'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "messege" ADD "read" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "messege" DROP COLUMN "read"`);
    }

}
