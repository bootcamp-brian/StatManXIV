const express = require("express");
const gearsetsRouter = express.Router();
const { getAllGearsets } = require("../db/gearsets");
const { getGearList } = require("./utils");

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
gearsetsRouter.get('/list/:gearSlot', async (req, res, next) => {
    try {
        const { gearSlot } = req.params;
        const gearSlotList = await getGearList(gearSlot);

        res.send({ gearSlotList });
    } catch ({ error, name, message }) {
        next({ error, name, message });
    } 
})

module.exports = gearsetsRouter;