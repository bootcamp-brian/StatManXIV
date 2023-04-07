const client = require("./client")

// creates a new gearset
async function createGearset({
    job,
    name,
    classId,
    mainhand,
    offhand,
    head,
    body,
    hands,
    legs,
    feet,
    earrings,
    necklace,
    bracelets,
    ring1,
    ring2,
    url
}) {
    try {
        const { rows: [gearset] } = await client.query(`
            INSERT INTO gearsets(
                job,
                name,
                "classId",
                mainhand,
                offhand,
                head,
                body,
                hands,
                legs,
                feet,
                earrings,
                necklace,
                bracelets,
                ring1,
                ring2,
                url
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
            RETURNING *;
        `, [ 
            job,
            name,
            classId,
            mainhand,
            offhand,
            head,
            body,
            hands,
            legs,
            feet,
            earrings,
            necklace,
            bracelets,
            ring1,
            ring2,
            url
        ]);

        return gearset;
    } catch (error) {
        console.error(error);
    }
}

// gets all gearsets
async function getAllGearsets() {
    try {
        const { rows } = await client.query(`
            SELECT *
            FROM gearsets
        `);

        return rows;
    } catch (error) {
        console.error(error);
    }
}

// gets gearset by job
async function getGearsetByJob(job) {
    try {
        const { rows: [gearset] } = await client.query(`
            SELECT *
            FROM gearsets
            WHERE job=$1;
        `, [job]);

        return gearset;
    } catch (error) {
        console.error(error);
    }
}

// // gets gearset by job
// async function getGearsetByJobId(jobId) {
//     try {
//         const { rows: [gearset] } = await client.query(`
//             SELECT *
//             FROM gearsets
//             WHERE "jobId"=$1;
//         `, [jobId]);

//         return gearset;
//     } catch (error) {
//         console.error(error);
//     }
// }

// gets gearset by id
async function getGearsetByName(name) {
    try {
        const { rows: [gearset] } = await client.query(`
            SELECT *
            FROM gearsets
            WHERE name=$1;
        `, [name]);

        if (gearset) {
            return gearset;
        } else {
            return false;
        }
    } catch (error) {
        console.error(error);
    }
}

// gets gearset by id
async function getGearsetById(gearsetId) {
    try {
        const { rows: [gearset] } = await client.query(`
            SELECT *
            FROM gearsets
            WHERE id=$1;
        `, [gearsetId]);

        return gearset;
    } catch (error) {
        console.error(error);
    }
}

// updates gearset info
async function updateGearset(job, { ...fields }) {
    try {
        const setString = Object.keys(fields).map(
            (key, index) => `"${ key }"=$${ index + 1 }`
        ).join(', ');

        const { rows: [gearset] } = await client.query(`
            UPDATE gearsets
            SET ${setString}
            WHERE job=$1
            RETURNING *;
        `, [job]);

        return gearset;
    } catch (error) {
        console.error(error);
    }
}

module.exports = {
    createGearset,
    getAllGearsets,
    getGearsetById,
    getGearsetByJob,
    updateGearset,
    getGearsetByName
}