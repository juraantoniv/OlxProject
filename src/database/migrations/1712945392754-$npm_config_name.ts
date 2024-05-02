import { MigrationInterface, QueryRunner } from "typeorm";

export class  $npmConfigName1712945392754 implements MigrationInterface {
    name = ' $npmConfigName1712945392754'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "messege" ADD "user_id_massages" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "messege" ADD CONSTRAINT "FK_e56790c98ed3e624776befcad5f" FOREIGN KEY ("user_id_massages") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "messege" DROP CONSTRAINT "FK_e56790c98ed3e624776befcad5f"`);
        await queryRunner.query(`ALTER TABLE "messege" DROP COLUMN "user_id_massages"`);
    }

}
