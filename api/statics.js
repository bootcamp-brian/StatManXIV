const express = require("express");
const { getStaticByName } = require("../db");
const staticsRouter = express.Router();

// GET /api/statics/:name
// Gets static by name
staticsRouter.get('/:name', async (req, res, next) => {
    try {
        const { name } = req.params;
        const static = await getStaticByName(name);
        
        res.send(static);
    } catch ({ error, name, message }) {
        next({ error, name, message });
    } 
})

module.exports = staticsRouter;