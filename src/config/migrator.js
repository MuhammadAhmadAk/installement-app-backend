const { Umzug, SequelizeStorage } = require('umzug');
const { sequelize } = require('./database');
const path = require('path');

const migrationsPath = path.join(__dirname, '../../migrations/*.js').replace(/\\/g, '/');

const migrator = new Umzug({
    migrations: {
        glob: migrationsPath,
        resolve: ({ name, path: migrationPath, context }) => {
            const migration = require(migrationPath);
            return {
                name,
                up: async () => migration.up(context, sequelize.Sequelize),
                down: async () => migration.down(context, sequelize.Sequelize),
            };
        },
    },
    context: sequelize.getQueryInterface(),
    storage: new SequelizeStorage({ sequelize }),
    logger: console,
});

const runMigrations = async () => {
    try {
        const pending = await migrator.pending();
        if (pending.length > 0) {
            console.log(`Applying ${pending.length} pending migrations...`);
            await migrator.up();
            console.log('All migrations applied successfully.');
        } else {
            console.log('Database is up to date.');
        }
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
};

module.exports = { runMigrations };