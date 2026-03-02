import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1772458045533 implements MigrationInterface {
    name = 'Init1772458045533'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`profileImage\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`profileImage\``);
    }

}
