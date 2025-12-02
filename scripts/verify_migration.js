const knex = require('knex')(require('../knexfile.cjs'));

async function verify() {
    try {
        const exists = await knex.schema.hasTable('test_table');
        if (exists) {
            console.log('SUCCESS: test_table exists.');
            const columns = await knex('test_table').columnInfo();
            console.log('Columns:', Object.keys(columns).join(', '));
        } else {
            console.error('FAILURE: test_table does not exist.');
            process.exit(1);
        }
    } catch (error) {
        console.error('Error verifying database:', error);
        process.exit(1);
    } finally {
        await knex.destroy();
    }
}

verify();
