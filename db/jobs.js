const client = require("./client")

// gets a list of all jobs
async function getAllJobs() {
    try {
        const { rows } = await client.query(`
            SELECT *
            FROM jobs;
        `);

        return rows;
    } catch (error) {
        console.error(error);
    }
}

async function getClassId(job) {
    try {
        const { rows: [ jobEntry ] } = await client.query(`
            SELECT *
            FROM jobs
            WHERE job=$1;
        `,[job]);

        return jobEntry.classId;
    } catch (error) {
        console.error(error);
    }
}

module.exports = {
    getClassId,
}