const client = require("./client")

// creates a new player
async function createPlayer(character, server, gearsetId) {
    try {
        const { rows: [player] } = await client.query(`
            INSERT INTO players(character, server, "gearsetId")
            VALUES ($1, $2, $3)
            ON CONFLICT (character) DO NOTHING
            RETURNING *;
        `, [character, server, gearsetId]);

        return player;
    } catch (error) {
        console.error(error);
    }
}

// gets player by character name
async function getPlayerByCharacter(character) {
    try {
        const { rows: [player] } = await client.query(`
            SELECT *
            FROM players
            WHERE character=$1;
        `, [character]);

        return player;
    } catch (error) {
        console.error(error);
    }
}

// gets player by id
async function getPlayerById(playerId) {
    try {
        const { rows: [player] } = await client.query(`
            SELECT *
            FROM players
            WHERE id=$1;
        `, [playerId]);

        return player;
    } catch (error) {
        console.error(error);
    }
}

// updates player info
async function updatePlayer(playerId, { ...fields }) {
    try {
        const setString = Object.keys(fields).map(
            (key, index) => `"${ key }"=$${ index + 1 }`
        ).join(', ');

        const { rows: [player] } = await client.query(`
            UPDATE players
            SET ${setString}
            WHERE id=${playerId}
            RETURNING *;
        `, Object.values(fields));

        return player;
    } catch (error) {
        console.error(error);
    }
}

// deletes player by id
async function deletePlayer(playerId) {
    try {
        const { rows: [player] } = await client.query(`
            DELETE FROM players
            WHERE id=$1
            RETURNING *;
        `, [playerId]);

        return player;
    } catch (error) {
        console.error(error);
    }
}

// gets players by static
async function getPlayersByStatic(staticId) {
    try {
        const { rows } = await client.query(`
            SELECT *
            FROM static_players
            JOIN players ON players.id=static_players."playerId"
            WHERE static_players."staticId"=$1;
        `, [staticId]);

        return rows;
    } catch (error) {
        console.error(error);
    }
}

module.exports = {
    createPlayer,
    getPlayerByCharacter,
    getPlayerById,
    updatePlayer,
    deletePlayer,
    getPlayersByStatic
}