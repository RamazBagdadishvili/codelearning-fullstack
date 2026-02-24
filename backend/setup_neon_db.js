const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const connectionString = 'postgresql://neondb_owner:npg_UyMp1wvc7Ima@ep-weathered-pond-agw3qb2s-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require';

async function setup() {
    const client = new Client({ connectionString });
    try {
        await client.connect();
        console.log('Connected to Neon DB successfully!');

        // 1. Read and execute schema.sql
        console.log('Executing schema.sql...');
        const schemaSql = fs.readFileSync(path.join(__dirname, '..', 'schema.sql'), 'utf8');
        await client.query(schemaSql);
        console.log('Schema created successfully.');

        // 2. Read and execute seed.sql
        console.log('Executing seed.sql...');
        const seedSql = fs.readFileSync(path.join(__dirname, '..', 'seed.sql'), 'utf8');
        await client.query(seedSql);
        console.log('Data seeded successfully.');

    } catch (err) {
        console.error('Error during setup:', err);
    } finally {
        await client.end();
        console.log('Connection closed.');
    }
}

setup();
