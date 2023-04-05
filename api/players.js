const express = require("express");
const { getPlayerByCharacter, getGearsetById, updatePlayer, getPlayersByStatic, getPlayerById, createPlayer, addPlayerToStatic, deleteStaticPlayer, getStaticById } = require("../db");
const playersRouter = express.Router();
const { getCharacterId, getCharacterInfo, getGearName, checkAuthorization } = require('./utils');

// GET /api/players/:staticId
// Gets players in a static
playersRouter.get('/:staticId', async (req, res, next) => {
    try {
        const params = req.params;
        const staticId = Number(params.staticId)
        const players = await getPlayersByStatic(staticId);
        
        res.send({ players });
    } catch ({ error, name, message }) {
        next({ error, name, message });
    } 
})

// playersRouter.get('/:characterName/:server', async (req, res, next) => {
//     try {
//         const params = req.params;
//         console.log(params)
//         const characterId = await getCharacterId(params.characterName, params.server)
//         const characterInfo = await getCharacterInfo(characterId);
//         const gearset = characterInfo.GearSet;
//         const { ClassID, Gear } = gearset;
//         delete Gear.SoulCrystal;
//         const playerGear = {};
        
//         for (let key in Gear) {
//             const gearId = Gear[key].ID;
//             const gearPiece = await getGearName(gearId);
//             playerGear[key.toLocaleLowerCase()] = gearPiece;
//         }

//         res.send({ playerGear });
//     } catch (error) {
//         next(error);
//     }
// });

// POST /api/players/
// creates a new player and adds them to the provided static
playersRouter.post('/', checkAuthorization, async (req, res, next) => {
    try {
        const { id: userId } = req.user;
        const { character, server, gearsetId, job, staticId } = req.body;
        const characterId = await getCharacterId(character, server);
        if (characterId) {
            const checkStatic = await getStaticById(staticId);
            if (checkStatic) {
                const player = await createPlayer(character, server, gearsetId, job);
                await addPlayerToStatic(player.id, staticId);
        
                res.send({message: 'success'})
            } else {
                res.status(404);
                next({
                    error: '404',
                    name: 'StaticNotFound',
                    message: `Static not found`
                })
            }
        } else {
            res.status(404);
            next({
                error: '404',
                name: 'CharacterNotFound',
                message: `${character} was not found on ${server}`
            })
        }
    } catch ({ error, name, message }) {
        next({ error, name, message });
    }
});

// PATCH /api/players/
// updates a player info based on id passed in body
playersRouter.patch('/', async (req, res, next) => {
    try {
        const { playerId } = req.body;
        const player = await getPlayerById(playerId);
        const { character, server, gearsetId, bisGear } = player;
        const characterId = await getCharacterId(character, server);
        const characterInfo = await getCharacterInfo(characterId);
        const currentGear = characterInfo.GearSet;
        const { JobID, Gear } = currentGear;

        if (JobID === bisGear.classId) {
            delete Gear.SoulCrystal;
            const gearUpdates = {};
            
            for (let key in Gear) {
                const gearId = Gear[key].ID;
                const gearPiece = await getGearName(gearId);
                if (gearPiece === bisGear[key.toLowerCase()]) {
                    gearUpdates[key.toLowerCase()] = true;
                } else if (key.toLowerCase() === 'ring1' || key.toLowerCase() === 'ring2') {
                    if (gearPiece === bisGear.ring1 || gearPiece === bisGear.ring2) {
                        gearUpdates[key.toLowerCase()] = true;
                    }
                }
            }
            
            const updatedPlayer = await updatePlayer(playerId, gearUpdates);
            res.send(updatedPlayer);
        } else {
            res.send({message: "Player's currently equipped job does not match their static job."})
        }
    } catch ({ error, name, message }) {
        next({ error, name, message });
    }
});

// PATCH /api/players/static
// updates a player info based on id passed in body
playersRouter.patch('/static', async (req, res, next) => {
    try {
        const { players } = req.body;

        for (let staticMember of players) {
            const player = await getPlayerById(staticMember.playerId);
            const { character, server, gearsetId, bisGear } = player;
            const characterId = await getCharacterId(character, server);
            if (!characterId) {
                continue;
            }
            const characterInfo = await getCharacterInfo(characterId);
            const currentGear = characterInfo.GearSet;
            const { JobID, Gear } = currentGear;
            if (JobID === bisGear.classId) {
                delete Gear.SoulCrystal;
                const gearUpdates = {};
                
                for (let key in Gear) {
                    const gearId = Gear[key].ID;
                    const gearPiece = await getGearName(gearId);
                    if (gearPiece === bisGear[key.toLowerCase()]) {
                        gearUpdates[key.toLowerCase()] = true;
                    } else if (key.toLowerCase() === 'ring1' || key.toLowerCase() === 'ring2') {
                        if (gearPiece === bisGear.ring1 || gearPiece === bisGear.ring2) {
                            gearUpdates[key.toLowerCase()] = true;
                        }
                    }
                }
                
                await updatePlayer(staticMember.playerId, gearUpdates);
            }
        }

        res.send({ message: 'sucess' })
    } catch ({ error, name, message }) {
        next({ error, name, message });
    }
});

// DELETE /api/players/
// Removes a player from a static based on id passed in body
playersRouter.delete('/static', checkAuthorization, async (req, res, next) => {
    try {
        const { playerId, staticId } = req.body;
        const { id: userId } = req.user;

        const static = await getStaticById(staticId);
        if (static.userId === userId) {
            const response = await deleteStaticPlayer(playerId, staticId);
            
            res.send({ response })
        } else {
            res.status(401);
            next({
                error: '401',
                name: 'UnauthorizedStaticError',
                message: 'You did not create that static.'
            })
        }

    } catch ({ error, name, message }) {
        next({ error, name, message });
    }
});

module.exports = playersRouter;