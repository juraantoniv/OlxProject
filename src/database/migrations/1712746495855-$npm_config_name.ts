import { MigrationInterface, QueryRunner } from "typeorm";

export class  $npmConfigName1712746495855 implements MigrationInterface {
    name = ' $npmConfigName1712746495855'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "refresh-tokens" DROP CONSTRAINT "FK_36f06086d2187ca909a4cf79030"`);
        await queryRunner.query(`ALTER TABLE "likes" DROP CONSTRAINT "FK_c05d5bce86a0bcbefe2e94fdeb5"`);
        await queryRunner.query(`ALTER TABLE "likes" DROP CONSTRAINT "FK_3f519ed95f775c781a254089171"`);
        await queryRunner.query(`ALTER TABLE "Goods" DROP CONSTRAINT "FK_ba2d3e133903143d84682ff31bf"`);
        await queryRunner.query(`ALTER TABLE "views" DROP CONSTRAINT "FK_5a616073aea982ac9a6c5eb40d1"`);
        await queryRunner.query(`ALTER TABLE "likes" RENAME COLUMN "cars_id" TO "good_id"`);
        await queryRunner.query(`CREATE TABLE "messege" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created" TIMESTAMP NOT NULL DEFAULT now(), "updated" TIMESTAMP NOT NULL DEFAULT now(), "good_id" uuid NOT NULL, "messages" text, "user_id" uuid NOT NULL, CONSTRAINT "PK_f6e584086be495cf7307e18c3d7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."users_role_enum" AS ENUM('costumer', 'seller', 'manager', 'admin')`);
        await queryRunner.query(`CREATE TYPE "public"."users_userpremiumrights_enum" AS ENUM('premium', 'default')`);
        await queryRunner.query(`CREATE TYPE "public"."users_active_enum" AS ENUM('active', 'banned')`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created" TIMESTAMP NOT NULL DEFAULT now(), "updated" TIMESTAMP NOT NULL DEFAULT now(), "name" text NOT NULL, "email" text NOT NULL, "password" text NOT NULL, "age" integer NOT NULL, "city" text, "role" "public"."users_role_enum" NOT NULL DEFAULT 'costumer', "userPremiumRights" "public"."users_userpremiumrights_enum" NOT NULL DEFAULT 'default', "active" "public"."users_active_enum" NOT NULL DEFAULT 'active', "avatar" text, CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "Goods" ADD "region" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "refresh-tokens" ADD CONSTRAINT "FK_36f06086d2187ca909a4cf79030" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "messege" ADD CONSTRAINT "FK_eac4fc36321940fdbf7cd6fc082" FOREIGN KEY ("good_id") REFERENCES "Goods"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "messege" ADD CONSTRAINT "FK_926350812aae8f263060558e4da" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "likes" ADD CONSTRAINT "FK_fe80b2226e95bf65203c9dd0b5c" FOREIGN KEY ("good_id") REFERENCES "Goods"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "likes" ADD CONSTRAINT "FK_3f519ed95f775c781a254089171" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Goods" ADD CONSTRAINT "FK_ba2d3e133903143d84682ff31bf" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "views" ADD CONSTRAINT "FK_5a616073aea982ac9a6c5eb40d1" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "views" DROP CONSTRAINT "FK_5a616073aea982ac9a6c5eb40d1"`);
        await queryRunner.query(`ALTER TABLE "Goods" DROP CONSTRAINT "FK_ba2d3e133903143d84682ff31bf"`);
        await queryRunner.query(`ALTER TABLE "likes" DROP CONSTRAINT "FK_3f519ed95f775c781a254089171"`);
        await queryRunner.query(`ALTER TABLE "likes" DROP CONSTRAINT "FK_fe80b2226e95bf65203c9dd0b5c"`);
        await queryRunner.query(`ALTER TABLE "messege" DROP CONSTRAINT "FK_926350812aae8f263060558e4da"`);
        await queryRunner.query(`ALTER TABLE "messege" DROP CONSTRAINT "FK_eac4fc36321940fdbf7cd6fc082"`);
        await queryRunner.query(`ALTER TABLE "refresh-tokens" DROP CONSTRAINT "FK_36f06086d2187ca909a4cf79030"`);
        await queryRunner.query(`ALTER TABLE "Goods" DROP COLUMN "region"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_active_enum"`);
        await queryRunner.query(`DROP TYPE "public"."users_userpremiumrights_enum"`);
        await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
        await queryRunner.query(`DROP TABLE "messege"`);
        await queryRunner.query(`ALTER TABLE "likes" RENAME COLUMN "good_id" TO "cars_id"`);
        await queryRunner.query(`ALTER TABLE "views" ADD CONSTRAINT "FK_5a616073aea982ac9a6c5eb40d1" FOREIGN KEY ("user_id") REFERENCES "usersData"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Goods" ADD CONSTRAINT "FK_ba2d3e133903143d84682ff31bf" FOREIGN KEY ("user_id") REFERENCES "usersData"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "likes" ADD CONSTRAINT "FK_3f519ed95f775c781a254089171" FOREIGN KEY ("user_id") REFERENCES "usersData"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "likes" ADD CONSTRAINT "FK_c05d5bce86a0bcbefe2e94fdeb5" FOREIGN KEY ("cars_id") REFERENCES "Goods"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "refresh-tokens" ADD CONSTRAINT "FK_36f06086d2187ca909a4cf79030" FOREIGN KEY ("user_id") REFERENCES "usersData"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
