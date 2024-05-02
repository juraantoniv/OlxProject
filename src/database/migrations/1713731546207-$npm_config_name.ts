import { MigrationInterface, QueryRunner } from "typeorm";

export class  $npmConfigName1713731546207 implements MigrationInterface {
    name = ' $npmConfigName1713731546207'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "messege" ADD "title" text`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "messege" DROP COLUMN "title"`);
    }

}
