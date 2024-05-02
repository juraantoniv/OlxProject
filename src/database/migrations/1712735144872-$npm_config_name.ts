import { MigrationInterface, QueryRunner } from "typeorm";

export class  $npmConfigName1712735144872 implements MigrationInterface {
    name = ' $npmConfigName1712735144872'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "refresh-tokens" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created" TIMESTAMP NOT NULL DEFAULT now(), "updated" TIMESTAMP NOT NULL DEFAULT now(), "refreshToken" text NOT NULL, "deviceId" text, "user_id" uuid NOT NULL, CONSTRAINT "PK_8c3ca3e3f1ad4fb45ec6b793aa0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."usersData_role_enum" AS ENUM('costumer', 'seller', 'manager', 'admin')`);
        await queryRunner.query(`CREATE TYPE "public"."usersData_userpremiumrights_enum" AS ENUM('premium', 'default')`);
        await queryRunner.query(`CREATE TYPE "public"."usersData_active_enum" AS ENUM('active', 'banned')`);
        await queryRunner.query(`CREATE TABLE "usersData" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created" TIMESTAMP NOT NULL DEFAULT now(), "updated" TIMESTAMP NOT NULL DEFAULT now(), "name" text NOT NULL, "email" text NOT NULL, "password" text NOT NULL, "age" integer NOT NULL, "city" text, "role" "public"."usersData_role_enum" NOT NULL DEFAULT 'costumer', "userPremiumRights" "public"."usersData_userpremiumrights_enum" NOT NULL DEFAULT 'default', "active" "public"."usersData_active_enum" NOT NULL DEFAULT 'active', "avatar" text, CONSTRAINT "PK_a782923b6bde291eda538779666" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "likes" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created" TIMESTAMP NOT NULL DEFAULT now(), "updated" TIMESTAMP NOT NULL DEFAULT now(), "cars_id" uuid NOT NULL, "user_id" uuid NOT NULL, CONSTRAINT "PK_a9323de3f8bced7539a794b4a37" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."Goods_active_enum" AS ENUM('nonActive', 'active')`);
        await queryRunner.query(`CREATE TABLE "Goods" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created" TIMESTAMP NOT NULL DEFAULT now(), "updated" TIMESTAMP NOT NULL DEFAULT now(), "title" text NOT NULL, "description" text NOT NULL, "location" text NOT NULL, "image" text, "currency_type" text NOT NULL, "price" integer NOT NULL, "active" "public"."Goods_active_enum" NOT NULL DEFAULT 'nonActive', "check_of_valid" integer NOT NULL DEFAULT '1', "user_id" uuid NOT NULL, CONSTRAINT "PK_3f52ada533a39a2c712854433f9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "views" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created" TIMESTAMP NOT NULL DEFAULT now(), "updated" TIMESTAMP NOT NULL DEFAULT now(), "good_id" uuid NOT NULL, "user_id" uuid NOT NULL, CONSTRAINT "PK_ae7537f375649a618fff0fb2cb6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "refresh-tokens" ADD CONSTRAINT "FK_36f06086d2187ca909a4cf79030" FOREIGN KEY ("user_id") REFERENCES "usersData"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "likes" ADD CONSTRAINT "FK_c05d5bce86a0bcbefe2e94fdeb5" FOREIGN KEY ("cars_id") REFERENCES "Goods"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "likes" ADD CONSTRAINT "FK_3f519ed95f775c781a254089171" FOREIGN KEY ("user_id") REFERENCES "usersData"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Goods" ADD CONSTRAINT "FK_ba2d3e133903143d84682ff31bf" FOREIGN KEY ("user_id") REFERENCES "usersData"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "views" ADD CONSTRAINT "FK_52f7716ecd32c7c838c08459230" FOREIGN KEY ("good_id") REFERENCES "Goods"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "views" ADD CONSTRAINT "FK_5a616073aea982ac9a6c5eb40d1" FOREIGN KEY ("user_id") REFERENCES "usersData"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "views" DROP CONSTRAINT "FK_5a616073aea982ac9a6c5eb40d1"`);
        await queryRunner.query(`ALTER TABLE "views" DROP CONSTRAINT "FK_52f7716ecd32c7c838c08459230"`);
        await queryRunner.query(`ALTER TABLE "Goods" DROP CONSTRAINT "FK_ba2d3e133903143d84682ff31bf"`);
        await queryRunner.query(`ALTER TABLE "likes" DROP CONSTRAINT "FK_3f519ed95f775c781a254089171"`);
        await queryRunner.query(`ALTER TABLE "likes" DROP CONSTRAINT "FK_c05d5bce86a0bcbefe2e94fdeb5"`);
        await queryRunner.query(`ALTER TABLE "refresh-tokens" DROP CONSTRAINT "FK_36f06086d2187ca909a4cf79030"`);
        await queryRunner.query(`DROP TABLE "views"`);
        await queryRunner.query(`DROP TABLE "Goods"`);
        await queryRunner.query(`DROP TYPE "public"."Goods_active_enum"`);
        await queryRunner.query(`DROP TABLE "likes"`);
        await queryRunner.query(`DROP TABLE "usersData"`);
        await queryRunner.query(`DROP TYPE "public"."usersData_active_enum"`);
        await queryRunner.query(`DROP TYPE "public"."usersData_userpremiumrights_enum"`);
        await queryRunner.query(`DROP TYPE "public"."usersData_role_enum"`);
        await queryRunner.query(`DROP TABLE "refresh-tokens"`);
    }

}
