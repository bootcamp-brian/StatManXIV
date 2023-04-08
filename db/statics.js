const client = require("./client");
const { getPlayersByStatic, deletePlayer } = require("./players");

// creates a new static
async function createStatic(name, userId) {
    try {
        const { rows: [static] } = await client.query(`
            INSERT INTO statics(name, "userId")
            VALUES ($1, $2)
            RETURNING *;
        `, [name, userId]);

        // for (let i = 0; i < 8; i++) {
        //     await createStaticPlayer(static.id);
        // }

        return static;
    } catch (error) {
        console.error(error);
    }
}

async function attachPlayersToStatic(static) {
    const players = await getPlayersByStatic(static.id);
    static.players = players;
    return static;
}

// gets static by id
async function getStaticById(staticId) {
    try {
        const { rows: [static] } = await client.query(`
            SELECT *
            FROM statics
            WHERE id=$1;
        `, [staticId]);

        if (static) {
            const staticWithPlayers = await attachPlayersToStatic(static);
            return staticWithPlayers;
        } else {
            return false;
        }
    } catch (error) {
        console.error(error);
    }
}

// gets a user's statics
async function getUserStatics(userId) {
    try {
        const { rows } = await client.query(`
            SELECT *
            FROM statics
            WHERE "userId"=$1;
        `, [userId]);

        const statics = await Promise.all(rows.map(attachPlayersToStatic))
        return statics;
    } catch (error) {
        console.error(error);
    }
}

// deletes static by id
async function deleteStatic(staticId) {
    try {
        const staticToDelete = await getStaticById(staticId);
        const { players } = staticToDelete;

        for (let player of players) {
            await deletePlayer(player.id);
        }

        const { rows: [deletedStatic] } = await client.query(`
            DELETE FROM statics
            WHERE id=$1
            RETURNING *;
        `, [staticId]);

        return deletedStatic;
    } catch (error) {
        console.error(error);
    }
}


module.exports = {
    createStatic,
    getStaticById,
    deleteStatic,
    getUserStatics
}