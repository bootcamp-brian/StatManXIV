const express = require("express");
const gearsetsRouter = express.Router();
const { getAllGearsets } = require("../db/gearsets");

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

module.exports = gearsetsRouter;