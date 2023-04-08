const express = require("express");
const { getPlayerByCharacter, getGearsetById, updatePlayer, getPlayersByStatic, getPlayerById, createPlayer, addPlayerToStatic, deleteStaticPlayer, getStaticById, deletePlayer } = require("../db");
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
                const player = await createPlayer(character, server, gearsetId, job, staticId);
        
                res.send( player )
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

// PATCH /api/players/toggleGear
// toggles value of a single gearSlot for a player
playersRouter.patch('/toggleGear', async (req, res, next) => {
    try {
        const { playerId, updateGearPieceObj } = req.body;

        const updatedPlayer = await updatePlayer(playerId, updateGearPieceObj)
        res.send(updatedPlayer)
    } catch ({ error, name, message }) {
        next({ error, name, message });
    }
});

// PATCH /api/players/info
// updates the player's job & gearset and resets equipment status
playersRouter.patch('/info', async (req, res, next) => {
    try {
        const { playerId, job, gearsetId } = req.body;
        const gearset = await getGearsetById(gearsetId);
        if (gearset.id === gearsetId) {
            res.status(400);
            next({
                error: 400,
                name: 'SameGearsetError',
                message: 'That player is already assigned this gearset.'
            })
        } else {
            const infoToUpdate = {
                job,
                gearsetId,
                mainhand: false,
                offhand: false,
                head: false,
                body: false,
                hands: false,
                legs: false,
                feet: false,
                earrings: false,
                necklace: false,
                bracelets: false,
                ring1: false,
                ring2: false,
            }
    
            const updatedPlayer = await updatePlayer(playerId, infoToUpdate)
            res.send(updatedPlayer)
        }
    } catch ({ error, name, message }) {
        next({ error, name, message });
    }
});

// PATCH /api/players/static
// updates the player info for all the members of a static
playersRouter.patch('/static', async (req, res, next) => {
    try {
        console.log(req.body)
        const { players } = req.body;

        for (let staticMember of players) {
            const player = await getPlayerById(staticMember.id);
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
                    if (gearPiece.toLowerCase() === bisGear[key.toLowerCase()].toLowerCase()) {
                        gearUpdates[key.toLowerCase()] = true;
                    } else if (key.toLowerCase() === 'ring1' || key.toLowerCase() === 'ring2') {
                        if (gearPiece.toLowerCase() === bisGear.ring1.toLowerCase() || gearPiece.toLowerCase() === bisGear.ring2.toLowerCase()) {
                            gearUpdates[key.toLowerCase()] = true;
                        }
                    }
                }
                
                await updatePlayer(staticMember.id, gearUpdates);
            }
        }

        res.send({ message: 'sucess' })
    } catch ({ error, name, message }) {
        next({ error, name, message });
    }
});

// PATCH /api/players/
// updates a player's info based on id passed in body
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
                if (gearPiece.toLowerCase() === bisGear[key.toLowerCase()].toLowerCase()) {
                    gearUpdates[key.toLowerCase()] = true;
                } else if (key.toLowerCase() === 'ring1' || key.toLowerCase() === 'ring2') {
                    if (gearPiece.toLowerCase() === bisGear.ring1.toLowerCase() || gearPiece.toLowerCase() === bisGear.ring2.toLowerCase()) {
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

// DELETE /api/players/
// Deletes a player based on id passed in body
playersRouter.delete('/static', checkAuthorization, async (req, res, next) => {
    try {
        const { playerId } = req.body;

        const response = await deletePlayer(playerId);
        
        res.send({ response })

    } catch ({ error, name, message }) {
        next({ error, name, message });
    }
});

module.exports = playersRouter;