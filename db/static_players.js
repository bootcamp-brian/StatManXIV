const client = require("./client")

// creates a new static_player
async function createStaticPlayer(staticId) {
    try {
        const { rows: [static_player] } = await client.query(`
            INSERT INTO static_players("staticId")
            VALUES ($1)
            RETURNING *;
        `, [staticId]);

        return static_player;
    } catch (error) {
        console.error(error);
    }
}

// adds a player to a static by editting the playerId column of static_players
// async function addPlayerToStatic(playerId, staticPlayerId) {
//     try {
//         const { rows: [static_player] } = await client.query(`
//             UPDATE static_players
//             SET "playerId"=$1
//             WHERE id=$2
//             RETURNING *;
//         `, [playerId, staticPlayerId]);

//         return static_player;
//     } catch (error) {
//         console.error(error);
//     }
// }
async function addPlayerToStatic(playerId, staticId) {
    try {
        const { rows: [static_player] } = await client.query(`
            INSERT INTO static_players("playerId", "staticId")
            VALUES ($1, $2)
            RETURNING *;
        `, [playerId, staticId]);

        return static_player;
    } catch (error) {
        console.error(error);
    }
}

// deletes a player from static baseid on playerId and staticId
async function deleteStaticPlayer(playerId, staticId) {
    try {
        const { rows: [static_player] } = await client.query(`
            DELETE FROM static_players
            WHERE "playerId"=$1 AND "staticId"=$2
            RETURNING *;
        `, [playerId, staticId]);

        return static_player;
    } catch (error) {
        console.error(error);
    }
}

// deletes static_player by id
// async function deleteStaticPlayer(staticPlayerId) {
//     try {
//         const { rows: [static_player] } = await client.query(`
//             DELETE FROM static_players
//             WHERE id=$1
//             RETURNING *;
//         `, [staticPlayerId]);

//         return static_player;
//     } catch (error) {
//         console.error(error);
//     }
// }


module.exports = {
    createStaticPlayer,
    deleteStaticPlayer,
    addPlayerToStatic
}