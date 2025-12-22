
const { SignJWT } = require('jose');

const secret = new TextEncoder().encode(
    'this-is-a-super-secret-jwt-key-for-local-development-12345',
);

async function generate() {
    const jwt = await new SignJWT({ role: 'postgres' }) // Using 'postgres' role as per docker-compose config
        .setProtectedHeader({ alg: 'HS256' })
        .sign(secret);

    console.log(jwt);
}

generate();
