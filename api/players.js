const express = require("express");
const { getPlayerByCharacter, getGearsetById, updatePlayer, getPlayersByStatic, getPlayerById } = require("../db");
const playersRouter = express.Router();
const { getCharacterId, getCharacterInfo, getGearName } = require('./utils');

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
    } catch (error) {
        next(error);
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
    } catch (error) {
        next(error);
    }
});

module.exports = playersRouter;