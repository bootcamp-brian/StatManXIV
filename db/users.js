const client = require("./client")
const bcrypt = require('bcrypt');
const SALT_COUNT = 10;

// creates a new user and returns without password
async function createUser(username, password) {
    try {
       const hashedPassword = await bcrypt.hash(password, SALT_COUNT);
        const { rows: [user] } = await client.query(`
            INSERT INTO users(username, password)
            VALUES ($1, $2)
            ON CONFLICT (username) DO NOTHING
            RETURNING *;
        `, [username, hashedPassword]);

        delete user.password;
        return user;
    } catch (error) {
        console.error(error);
    }
}

// gets user by username and returns with password
async function getUserByUsername(username) {
    try {
        const { rows: [user] } = await client.query(`
            SELECT *
            FROM users
            WHERE username=$1;
        `, [username]);

        return user;
    } catch (error) {
        console.error(error);
    }
}

// gets user by username and returns with password
async function verifyUser(username, password) {
    try {
        const user = await getUserByUsername(username);
        const hashedPassword = user.password;

        let passwordsMatch = await bcrypt.compare(password, hashedPassword)
        console.log(user, passwordsMatch)
        if (passwordsMatch) {
            delete user.password;
            return user;
        } else {
            return false;
        }
    } catch (error) {
        console.error(error);
    }
}

// gets user by id and returns with password
async function getUserById(userId) {
    try {
        const { rows: [user] } = await client.query(`
            SELECT *
            FROM users
            WHERE id=$1;
        `, [userId]);

        return user;
    } catch (error) {
        console.error(error);
    }
}

// updates a user to be an admin and returns info w/o password
async function makeAdmin(userId) {
    try {
        const { rows: [user] } = await client.query(`
            UPDATE users
            SET admin=${true}
            WHERE id=$1
            RETURNING *;
        `, [userId]);

        delete user.password;
        return user;
    } catch (error) {
        console.error(error);
    }
}

module.exports = {
    createUser,
    getUserById,
    getUserByUsername,
    makeAdmin,
    verifyUser
}