require('dotenv').config();
const { login } = require('./src/controllers/authController');
const { pool } = require('./src/config/db');
const fs = require('fs');

async function testLogin() {
    let output = '--- Testing Login Logic ---\n';
    const req = {
        body: {
            email: 'admin@codelearning.ge',
            password: 'Admin123!'
        }
    };
    const res = {
        status: function (code) {
            this.statusCode = code;
            return this;
        },
        json: function (data) {
            output += 'RESPONSE STATUS: ' + (this.statusCode || 200) + '\n';
            output += 'RESPONSE DATA: ' + JSON.stringify(data, null, 2) + '\n';
        }
    };
    const next = (err) => {
        output += 'NEXT ERROR: ' + (err.stack || err.toString()) + '\n';
    };

    try {
        await login(req, res, next);
    } catch (e) {
        output += 'TESTING FAILURE: ' + (e.stack || e.toString()) + '\n';
    } finally {
        fs.writeFileSync('login_output.txt', output);
        await pool.end();
        process.exit(0);
    }
}

testLogin();
