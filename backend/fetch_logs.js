const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function fetchLogs() {
    try {
        await ssh.connect({
            host: '161.35.205.90',
            username: 'root',
            password: 'frankfurtS5000port'
        });

        console.log('Connected!');

        const result = await ssh.execCommand('pm2 logs backend --lines 50 --nostream');
        console.log('STDOUT:', result.stdout);
        console.log('STDERR:', result.stderr);

        ssh.dispose();
    } catch (err) {
        console.error('Failed to fetch logs:', err);
        process.exit(1);
    }
}

fetchLogs();
