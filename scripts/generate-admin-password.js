const crypto = require('crypto');
const readline = require('readline');

const terminal = readline.createInterface({ input: process.stdin, output: process.stdout });
terminal.question('Choose a strong admin password: ', (password) => {
    if (password.length < 16) {
        console.error('Use at least 16 characters.');
        terminal.close();
        process.exitCode = 1;
        return;
    }
    const salt = crypto.randomBytes(16);
    const hash = crypto.scryptSync(password, salt, 64);
    console.log(`\nADMIN_PASSWORD_HASH=scrypt$${salt.toString('base64url')}$${hash.toString('base64url')}`);
    console.log(`ADMIN_SESSION_SECRET=${crypto.randomBytes(32).toString('base64url')}`);
    terminal.close();
});
