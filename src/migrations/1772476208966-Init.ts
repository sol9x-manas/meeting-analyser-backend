import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1772476208966 implements MigrationInterface {
    name = 'Init1772476208966'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`provider\` enum ('local', 'google') NOT NULL DEFAULT 'local'`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`providerId\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD UNIQUE INDEX \`IDX_0ad4792ebd254550ad4fdb55d6\` (\`providerId\`)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` DROP INDEX \`IDX_0ad4792ebd254550ad4fdb55d6\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`providerId\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`provider\``);
    }

}
