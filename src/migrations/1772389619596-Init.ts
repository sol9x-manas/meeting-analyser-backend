import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1772389619596 implements MigrationInterface {
    name = 'Init1772389619596'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`refreshToken\` \`currentHashedRefreshToken\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`currentHashedRefreshToken\``);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`currentHashedRefreshToken\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`currentHashedRefreshToken\``);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`currentHashedRefreshToken\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`currentHashedRefreshToken\` \`refreshToken\` varchar(255) NULL`);
    }

}
