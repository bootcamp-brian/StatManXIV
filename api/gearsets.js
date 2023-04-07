const express = require("express");
const gearsetsRouter = express.Router();
const { getAllGearsets, createGearset, getGearsetByName } = require("../db/gearsets");
const { getGearList, checkAuthorization } = require("./utils");
const { getClassId } = require("../db/jobs");

// GET /api/gearsets/
// Gets all gearsets
gearsetsRouter.get('/', async (req, res, next) => {
    try {
        const gearsets = await getAllGearsets();

        res.send({ gearsets });
    } catch ({ error, name, message }) {
        next({ error, name, message });
    } 
})

// GET /api/gearsets/list/:gearSlot
// Gets a list of gear for a specific slot
gearsetsRouter.get('/list/:gearSlot/:job', async (req, res, next) => {
    try {
        const { gearSlot, job } = req.params;
        const gearSlotList = await getGearList(gearSlot, job);

        res.send({ gearSlotList });
    } catch ({ error, name, message }) {
        next({ error, name, message });
    } 
})

// POST /api/gearsets/
// Creates a new gearset
gearsetsRouter.post('/', checkAuthorization, async (req, res, next) => {
    try {
        const { gearsetInfo } = req.body;
        const checkGearset = await getGearsetByName(gearsetInfo.name)

        if (checkGearset) {
            res.status(403);
            next({
                error: '403',
                name: 'GearsetNameTakenError',
                message: `Gearset name ${gearsetInfo.name} is already in use.`
            });
        } else {
            const classId = await getClassId(gearsetInfo.job);
            gearsetInfo.classId = classId;
            const newGearset = await createGearset(gearsetInfo);
    
            res.send({ newGearset });
        }
    } catch ({ error, name, message }) {
        next({ error, name, message });
    } 
})

module.exports = gearsetsRouter;