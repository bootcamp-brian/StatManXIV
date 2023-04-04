const client = require("./client");
const { createGearset } = require("./gearsets");
const { createPlayer, getPlayersByStatic } = require("./players");
const { createStatic } = require("./statics");
const { addPlayerToStatic } = require("./static_players");
const { createUser } = require("./users");

// async function getChat() {
//     const { rows } = await client.query(`
//     SELECT *
//     FROM chat
//     `);
//     console.log(rows);
//     return rows;
// }

async function dropTables() {
    try {
        console.log("Dropping All Tables...")
        await client.query(`
        DROP TABLE IF EXISTS static_players;
        DROP TABLE IF EXISTS statics;
        DROP TABLE IF EXISTS players;
        DROP TABLE IF EXISTS gearsets;
        DROP TABLE IF EXISTS jobs;
        DROP TABLE IF EXISTS users;
        `);
        console.log("Finished dropping tables...")
    } catch (error) {
        console.error("Error dropping tables!");
        throw error;
    }
}

async function createTables() {
    try {
        console.log("Starting to build tables...");
        await client.query(`
            CREATE TABLE users (
                id SERIAL PRIMARY KEY,
                username VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                admin BOOLEAN DEFAULT false
            );
        `);
        await client.query(`
            CREATE TABLE jobs (
                id SERIAL PRIMARY KEY,
                job VARCHAR(255) UNIQUE NOT NULL,
                "classId" INTEGER NOT NULL
            );
        `);
        await client.query(`
            CREATE TABLE gearsets (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) UNIQUE NOT NULL,
                job VARCHAR(255) NOT NULL,
                "classId" INTEGER NOT NULL,
                mainhand VARCHAR(255) NOT NULL,
                offhand VARCHAR(255),
                head VARCHAR(255) NOT NULL,
                body VARCHAR(255) NOT NULL,
                hands VARCHAR(255) NOT NULL,
                legs VARCHAR(255) NOT NULL,
                feet VARCHAR(255) NOT NULL,
                earrings VARCHAR(255) NOT NULL,
                necklace VARCHAR(255) NOT NULL,
                bracelets VARCHAR(255) NOT NULL,
                ring1 VARCHAR(255) NOT NULL,
                ring2 VARCHAR(255) NOT NULL,
                url VARCHAR(255)
            );
        `);
        await client.query(`
            CREATE TABLE players (
                id SERIAL PRIMARY KEY,
                character VARCHAR(255) UNIQUE NOT NULL,
                job VARCHAR(255) NOT NULL,
                server VARCHAR(255) NOT NULL,
                "gearsetId" INTEGER REFERENCES gearsets(id) NOT NULL,
                mainhand BOOLEAN DEFAULT false,
                offhand BOOLEAN DEFAULT false,
                head BOOLEAN DEFAULT false,
                body BOOLEAN DEFAULT false,
                hands BOOLEAN DEFAULT false,
                legs BOOLEAN DEFAULT false,
                feet BOOLEAN DEFAULT false,
                earrings BOOLEAN DEFAULT false,
                necklace BOOLEAN DEFAULT false,
                bracelets BOOLEAN DEFAULT false,
                ring1 BOOLEAN DEFAULT false,
                ring2 BOOLEAN DEFAULT false 
            );
        `);
        await client.query(`
            CREATE TABLE statics (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) UNIQUE NOT NULL,
                "userId" INTEGER REFERENCES users(id) NOT NULL
            );
        `);
        await client.query(`
            CREATE TABLE static_players (
                id SERIAL PRIMARY KEY,
                "staticId" INTEGER REFERENCES statics(id) NOT NULL,
                "playerId" INTEGER REFERENCES players(id)
            );
        `);
        console.log("Finished building tables!");
    } catch (error) {
        console.error("Error building tables!");
        throw error;
    } 
}

async function createJobs() {
    console.log("Creating jobs");
    async function createJob({ job, classId }) {
        try {
            const { rows: [jobEntry] } = await client.query(`
                INSERT INTO jobs(job, "classId")
                VALUES ($1, $2)
                ON CONFLICT (job) DO NOTHING
                RETURNING *;
            `, [job, classId]);
            
            return jobEntry;
        } catch (error) {
            console.error(error);
        }
    }

    try {
        const jobList = [
            { job: "pld", classId: 19},
            { job: "mnk", classId: 20},
            { job: "war", classId: 21},
            { job: "drg", classId: 22},
            { job: "brd", classId: 23},
            { job: "whm", classId: 24},
            { job: "blm", classId: 25},
            { job: "smn", classId: 27},
            { job: "sch", classId: 28},
            { job: "nin", classId: 30},
            { job: "mch", classId: 31},
            { job: "drk", classId: 32},
            { job: "ast", classId: 33},
            { job: "sam", classId: 34},
            { job: "rdm", classId: 35},
            { job: "gnb", classId: 37},
            { job: "dnc", classId: 38},
            { job: "rpr", classId: 39},
            { job: "sge", classId: 40}
        ]
    
        for (let pair of jobList) {
            await createJob(pair);
        }
    } catch (error) {
        console.error(error);
    }
    console.log("Done creating jobs");
}

async function createGearsets() {
    console.log("Creating gearsets");
    try {
        const pld = {
            job: "pld",
            name: "pld 6.3",
            classId: 19,
            mainhand: "Abyssos Bastard Sword",
            offhand: "Abyssos Shield",
            head: "Augmented Lunar Envoy's Face Guard of Fending",
            body: "Abyssos Cuirass of Fending",
            hands: "Augmented Lunar Envoy's Gloves of Fending",
            legs: "Augmented Lunar Envoy's Trousers of Fending",
            feet: "Abyssos Sollerets of Fending",
            earrings: "Abyssos Earrings of Fending",
            necklace: "Augmented Lunar Envoy's Necklace of Fending",
            bracelets: "Abyssos Amulet of Fending",
            ring1: "Augmented Lunar Envoy's Ring of Fending",
            ring2: "Abyssos Ring of Fending",
            url: null
        }
        const mnk = {
            job: "mnk",
            name: "mnk 6.3 - 1.94",
            classId: 20,
            mainhand: "Abyssos Baghnakhs",
            offhand: null,
            head: "Abyssos Hood of Striking",
            body: "Abyssos Acton of Striking",
            hands: "Augmented Lunar Envoy's Gloves of Striking",
            legs: "Abyssos Brais of Striking",
            feet: "Abyssos Boots of Striking",
            earrings: "Augmented Lunar Envoy's Earring of Slaying",
            necklace: "Augmented Lunar Envoy's Necklace of Slaying",
            bracelets: "Augmented Lunar Envoy's Bracelets of Slaying",
            ring1: "Augmented Lunar Envoy's Ring of Slaying",
            ring2: "Abyssos Ring of Slaying",
            url: null
        }
        const war = {
            job: "war",
            name: "war 6.3",
            classId: 21,
            mainhand: "Abyssos War Axe",
            offhand: null,
            head: "Augmented Lunar Envoy's Face Guard of Fending",
            body: "Abyssos Cuirass of Fending",
            hands: "Augmented Lunar Envoy's Gloves of Fending",
            legs: "Augmented Lunar Envoy's Trousers of Fending",
            feet: "Abyssos Sollerets of Fending",
            earrings: "Abyssos Earrings of Fending",
            necklace: "Augmented Lunar Envoy's Necklace of Fending",
            bracelets: "Abyssos Amulet of Fending",
            ring1: "Augmented Lunar Envoy's Ring of Fending",
            ring2: "Abyssos Ring of Fending",
            url: null
        }
        const drg = {
            job: "drg",
            name: "drg 6.3",
            classId: 22,
            mainhand: "Abyssos Partisan",
            offhand: null,
            head: "Abyssos Helm of Maiming",
            body: "Abyssos Cuirass of Maiming",
            hands: "Augmented Lunar Envoy's Fingerless Gloves of Maiming",
            legs: "Augmented Lunar Envoy's Trousers of Maiming",
            feet: "Abyssos Sollerets of Maiming",
            earrings: "Augmented Lunar Envoy's Earring of Slaying",
            necklace: "Augmented Lunar Envoy's Necklace of Slaying",
            bracelets: "Abyssos Amulet of Slaying",
            ring1: "Augmented Lunar Envoy's Ring of Slaying",
            ring2: "Abyssos Ring of Slaying",
            url: null
        }
        const brd = {
            job: "brd",
            name: "brd 6.3",
            classId: 23,
            mainhand: "Abyssos Compound Bow",
            offhand: null,
            head: "Abyssos Mask of Aiming",
            body: "Abyssos Coat of Aiming",
            hands: "Augmented Lunar Envoy's Fingerless Gloves of Aiming",
            legs: "Augmented Lunar Envoy's Trousers of Aiming",
            feet: "Abyssos Thighboots of Aiming",
            earrings: "Abyssos Earrings of Aiming",
            necklace: "Abyssos Choker of Aiming",
            bracelets: "Augmented Lunar Envoy's Bracelets of Aiming",
            ring1: "Augmented Lunar Envoy's Ring of Aiming",
            ring2: "Abyssos Ring of Aiming",
            url: null
        }
        const whm = {
            job: "whm",
            name: "whm 6.3",
            classId: 24,
            mainhand: "Abyssos Staff",
            offhand: null,
            head: "Augmented Lunar Envoy's Hairpin of Healing",
            body: "Abyssos Surcoat of Healing",
            hands: "Augmented Lunar Envoy's Gloves of Healing",
            legs: "Augmented Lunar Envoy's Longkilt of Healing",
            feet: "Abyssos Boots of Healing",
            earrings: "Abyssos Earrings of Healing",
            necklace: "Augmented Lunar Envoy's Necklace of Healing",
            bracelets: "Augmented Lunar Envoy's Bracelets of Healing",
            ring1: "Abyssos Ring of Healing",
            ring2: "Rinascita Ring of Healing",
            url: null
        }
        const blm = {
            job: "blm",
            name: "blm 6.3 - 2287 SPS",
            classId: 25,
            mainhand: "Abyssos Rod",
            offhand: null,
            head: "Abyssos Helm of Casting",
            body: "Augmented Lunar Envoy's Justaucorps of Casting",
            hands: "Augmented Lunar Envoy's Gloves of Casting",
            legs: "Abyssos Culottes of Casting",
            feet: "Abyssos Boots of Casting",
            earrings: "Augmented Lunar Envoy's Earring of Casting",
            necklace: "Abyssos Choker of Casting",
            bracelets: "Augmented Lunar Envoy's Bracelets of Casting",
            ring1: "Augmented Lunar Envoy's Ring of Casting",
            ring2: "Abyssos Ring of Casting",
            url: null
        }
        const smn = {
            job: "smn",
            name: "smn 6.3",
            classId: 27,
            mainhand: "Abysseia",
            offhand: null,
            head: "Augmented Lunar Envoy's Hairpin of Casting",
            body: "Abyssos Surcoat of Casting",
            hands: "Abyssos Armguards of Casting",
            legs: "Augmented Lunar Envoy's Longkilt of Casting",
            feet: "Augmented Lunar Envoy's Boots of Casting",
            earrings: "Abyssos Earrings of Casting",
            necklace: "Augmented Lunar Envoy's Necklace of Casting",
            bracelets: "Abyssos Amulet of Casting",
            ring1: "Augmented Lunar Envoy's Ring of Casting",
            ring2: "Abyssos Ring of Casting",
            url: null
        }
        const sch = {
            job: "sch",
            name: "sch 6.3",
            classId: 28,
            mainhand: "Call of the Abyss",
            offhand: null,
            head: "Augmented Lunar Envoy's Hairpin of Healing",
            body: "Abyssos Surcoat of Healing",
            hands: "Augmented Lunar Envoy's Gloves of Healing",
            legs: "Augmented Lunar Envoy's Longkilt of Healing",
            feet: "Abyssos Boots of Healing",
            earrings: "Abyssos Earrings of Healing",
            necklace: "Augmented Lunar Envoy's Necklace of Healing",
            bracelets: "Augmented Lunar Envoy's Bracelets of Healing",
            ring1: "Abyssos Ring of Healing",
            ring2: "Rinascita Ring of Healing",
            url: null
        }
        const nin = {
            job: "nin",
            name: "nin 6.3",
            classId: 30,
            mainhand: "Abyssos Cleavers",
            offhand: null,
            head: "Augmented Lunar Envoy's Turban of Scouting",
            body: "Abyssos Coat of Scouting",
            hands: "Abyssos Gloves of Scouting",
            legs: "Augmented Lunar Envoy's Trousers of Scouting",
            feet: "Abyssos Thighboots of Scouting",
            earrings: "Abyssos Earrings of Aiming",
            necklace: "Abyssos Choker of Aiming",
            bracelets: "Augmented Lunar Envoy's Bracelets of Aiming",
            ring1: "Lunar Envoy's Ring of Aiming",
            ring2: "Augmented Lunar Envoy's Ring of Aiming",
            url: null
        }
        const mch = {
            job: "mch",
            name: "mch 6.3",
            classId: 31,
            mainhand: "Abyssos Pistol",
            offhand: null,
            head: "Abyssos Mask of Aiming",
            body: "Abyssos Coat of Aiming",
            hands: "Augmented Lunar Envoy's Fingerless Gloves of Aiming",
            legs: "Augmented Lunar Envoy's Trousers of Aiming",
            feet: "Abyssos Thighboots of Aiming",
            earrings: "Abyssos Earrings of Aiming",
            necklace: "Abyssos Choker of Aiming",
            bracelets: "Augmented Lunar Envoy's Bracelets of Aiming",
            ring1: "Augmented Lunar Envoy's Ring of Aiming",
            ring2: "Abyssos Ring of Aiming",
            url: null
        }
        const drk = {
            job: "drk",
            name: "drk 6.3",
            classId: 32,
            mainhand: "Abyssos Guillotine",
            offhand: null,
            head: "Augmented Lunar Envoy's Face Guard of Fending",
            body: "Abyssos Cuirass of Fending",
            hands: "Augmented Lunar Envoy's Gloves of Fending",
            legs: "Augmented Lunar Envoy's Trousers of Fending",
            feet: "Abyssos Sollerets of Fending",
            earrings: "Abyssos Earrings of Fending",
            necklace: "Augmented Lunar Envoy's Necklace of Fending",
            bracelets: "Abyssos Amulet of Fending",
            ring1: "Augmented Lunar Envoy's Ring of Fending",
            ring2: "Abyssos Ring of Fending",
            url: null
        }
        const ast = {
            job: "ast",
            name: "ast 6.3 - crafted 2.31",
            classId: 33,
            mainhand: "Abyssos Orrery",
            offhand: null,
            head: "Augmented Lunar Envoy's Hairpin of Healing",
            body: "Abyssos Surcoat of Healing",
            hands: "Augmented Lunar Envoy's Gloves of Healing",
            legs: "Augmented Lunar Envoy's Longkilt of Healing",
            feet: "Abyssos Boots of Healing",
            earrings: "Abyssos Earrings of Healing",
            necklace: "Augmented Lunar Envoy's Necklace of Healing",
            bracelets: "Augmented Lunar Envoy's Bracelets of Healing",
            ring1: "Abyssos Ring of Healing",
            ring2: "Rinascita Ring of Healing",
            url: null
        }
        const sam = {
            job: "sam",
            name: "sam 6.3 - 2.15",
            classId: 34,
            mainhand: "Abyssos Blade",
            offhand: null,
            head: "Abyssos Hood of Striking",
            body: "Abyssos Acton of Striking",
            hands: "Augmented Lunar Envoy's Gloves of Striking",
            legs: "Abyssos Brais of Striking",
            feet: "Abyssos Boots of Striking",
            earrings: "Augmented Lunar Envoy's Earring of Slaying",
            necklace: "Augmented Lunar Envoy's Necklace of Slaying",
            bracelets: "Abyssos Amulet of Slaying",
            ring1: "Augmented Lunar Envoy's Ring of Slaying",
            ring2: "Abyssos Ring of Slaying",
            url: null
        }
        const rdm = {
            job: "rdm",
            name: "rdm 6.3",
            classId: 35,
            mainhand: "Abyssos Degen",
            offhand: null,
            head: "Augmented Lunar Envoy's Hairpin of Casting",
            body: "Abyssos Surcoat of Casting",
            hands: "Abyssos Armguards of Casting",
            legs: "Augmented Lunar Envoy's Longkilt of Casting",
            feet: "Augmented Lunar Envoy's Boots of Casting",
            earrings: "Abyssos Earrings of Casting",
            necklace: "Augmented Lunar Envoy's Necklace of Casting",
            bracelets: "Abyssos Amulet of Casting",
            ring1: "Augmented Lunar Envoy's Ring of Casting",
            ring2: "Abyssos Ring of Casting",
            url: null
        }
        const gnb = {
            job: "gnb",
            name: "gnb 6.3",
            classId: 37,
            mainhand: "Abyssos Sawback",
            offhand: null,
            head: "Augmented Lunar Envoy's Face Guard of Fending",
            body: "Abyssos Cuirass of Fending",
            hands: "Augmented Lunar Envoy's Gloves of Fending",
            legs: "Augmented Lunar Envoy's Trousers of Fending",
            feet: "Abyssos Sollerets of Fending",
            earrings: "Abyssos Earrings of Fending",
            necklace: "Augmented Lunar Envoy's Necklace of Fending",
            bracelets: "Abyssos Amulet of Fending",
            ring1: "Augmented Lunar Envoy's Ring of Fending",
            ring2: "Abyssos Ring of Fending",
            url: null
        }
        const dnc = {
            job: "dnc",
            name: "dnc 6.3",
            classId: 38,
            mainhand: "Abyssos Chakrams",
            offhand: null,
            head: "Abyssos Mask of Aiming",
            body: "Abyssos Coat of Aiming",
            hands: "Augmented Lunar Envoy's Fingerless Gloves of Aiming",
            legs: "Augmented Lunar Envoy's Trousers of Aiming",
            feet: "Abyssos Thighboots of Aiming",
            earrings: "Abyssos Earrings of Aiming",
            necklace: "Abyssos Choker of Aiming",
            bracelets: "Augmented Lunar Envoy's Bracelets of Aiming",
            ring1: "Augmented Lunar Envoy's Ring of Aiming",
            ring2: "Abyssos Ring of Aiming",
            url: null
        }
        const rpr = {
            job: "rpr",
            name: "rpr 6.3",
            classId: 39,
            mainhand: "Abyssos Sickle",
            offhand: null,
            head: "Abyssos Helm of Maiming",
            body: "Abyssos Cuirass of Maiming",
            hands: "Augmented Lunar Envoy's Fingerless Gloves of Maiming",
            legs: "Augmented Lunar Envoy's Trousers of Maiming",
            feet: "Abyssos Sollerets of Maiming",
            earrings: "Augmented Lunar Envoy's Earring of Slaying",
            necklace: "Augmented Lunar Envoy's Necklace of Slaying",
            bracelets: "Abyssos Amulet of Slaying",
            ring1: "Augmented Lunar Envoy's Ring of Slaying",
            ring2: "Abyssos Ring of Slaying",
            url: null
        }
        const sge = {
            job: "sge",
            name: "sge 6.3",
            classId: 40,
            mainhand: "Abyssos Wings",
            offhand: null,
            head: "Augmented Lunar Envoy's Hairpin of Healing",
            body: "Abyssos Surcoat of Healing",
            hands: "Augmented Lunar Envoy's Gloves of Healing",
            legs: "Augmented Lunar Envoy's Longkilt of Healing",
            feet: "Abyssos Boots of Healing",
            earrings: "Abyssos Earrings of Healing",
            necklace: "Augmented Lunar Envoy's Necklace of Healing",
            bracelets: "Augmented Lunar Envoy's Bracelets of Healing",
            ring1: "Abyssos Ring of Healing",
            ring2: "Rinascita Ring of Healing",
            url: null
        }

        await createGearset(pld); //1
        await createGearset(mnk); //2
        await createGearset(war); //3
        await createGearset(drg); //4
        await createGearset(brd); //5
        await createGearset(whm); //6
        await createGearset(blm); //7
        await createGearset(smn); //8
        await createGearset(sch); //9
        await createGearset(nin); //10
        await createGearset(mch); //11
        await createGearset(drk); //12
        await createGearset(ast); //13
        await createGearset(sam); //14
        await createGearset(rdm); //15
        await createGearset(gnb); //16
        await createGearset(dnc); //17
        await createGearset(rpr); //18
        await createGearset(sge); //19
    } catch (error) {
        console.error(error);
    }
    console.log("Done creating gearsets");
}

async function createTestUsers() {
    await createUser('braintm', 'readytosail')
}

async function createTestPlayers() {
    await createPlayer("lime grove", "malboro", 6, 'whm');
    await createPlayer("top text", "malboro", 12, 'drk');
    await createPlayer("gurr aarg", "malboro", 16, 'gnb');
    await createPlayer("rawr wars", "malboro", 9, 'sch');
    await createPlayer("ambrosia eternum", "malboro", 10, 'nin');
    // await createPlayer("genevieve frenbl", "malboro", 18, 'rpr');
    await createPlayer("midora aurora", "malboro", 4, 'drg');
    await createPlayer("aava sihn", "malboro", 8, 'smn');
    await createPlayer("ratboy rights", "malboro", 17, 'dnc');
}

async function createTestStatic() {
    await createStatic('JORTS', 1);

    for (let i = 0; i < 8; i++) {
        await addPlayerToStatic(i + 1, 1);
    }
}
async function rebuildDB() {
    try {
        await dropTables()
        await createTables()
        await createJobs()
        await createGearsets()
        await createTestUsers()
        await createTestPlayers()
        await createTestStatic()
    } catch (error) {
        console.log("Error during rebuildDB")
        throw error
    }
}

module.exports = {
    rebuildDB
}