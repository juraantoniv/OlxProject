import { MigrationInterface, QueryRunner } from "typeorm";

export class  $npmConfigName1713477891940 implements MigrationInterface {
    name = ' $npmConfigName1713477891940'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "messege" DROP CONSTRAINT "FK_eac4fc36321940fdbf7cd6fc082"`);
        await queryRunner.query(`ALTER TABLE "messege" DROP COLUMN "good_id"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "messege" ADD "good_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "messege" ADD CONSTRAINT "FK_eac4fc36321940fdbf7cd6fc082" FOREIGN KEY ("good_id") REFERENCES "Goods"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
