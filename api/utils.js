const fetch = require('node-fetch');
const jwt = require('jsonwebtoken');
const { getUserById } = require('../db');
const { JWT_SECRET, JWT_SECRET_ADMIN } = process.env;

const BASE_URL = 'https://xivapi.com';

const jobClassIdMap = {
    pld: 19,
    mnk: 20,
    war: 21,
    drg: 22,
    brd: 23,
    whm: 24,
    blm: 25,
    smn: 27,
    sch: 28,
    nin: 30,
    mch: 31,
    drk: 32,
    ast: 33,
    sam: 34,
    rdm: 35,
    gnb: 37,
    dnc: 38,
    rpr: 39,
    sge: 40
}

const getCharacterId = async (name, server) => {
    const response = await fetch(`${BASE_URL}/character/search?name=${name.replace(' ', '+')}&server=${server}`, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json'
        }
    });

    const data = await response.json();
    if (data.Results[0]) {
        return data.Results[0].ID;
    } else {
        return false;
    }
}

const getCharacterInfo = async (characterId) => {
    const response = await fetch(`${BASE_URL}/character/${characterId}`, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json'
        }
    });

    const data = await response.json();
    return data.Character;
}

const getGearName = async (gearId) => {
    const response = await fetch(`${BASE_URL}/item/${gearId}?columns=Name`, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json'
        }
    });

    const data = await response.json();
    return data.Name;
}

const getGearList = async (gearSlot) => {
    const response = await fetch(`${BASE_URL}/search?filters=LevelItem>=620,EquipSlotCategory.${gearSlot}=1&limit=500`, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const data = await response.json();
    return data.Results;
}

const checkAuthorization = async (req, res, next) => {
    const prefix = 'Bearer ';
    const auth = req.header('Authorization');
  
    if (!auth) {
        res.status(401);
        next({
            error: '401',
            name: 'UnauthorizedError',
            message: 'You must be logged in to perform this action.'
        });
    } else if (auth.startsWith(prefix)) {
      const token = auth.slice(prefix.length);
  
      try {
        const { id } = jwt.verify(token, JWT_SECRET);
  
        if (id) {
          req.user = await getUserById(id);
          next();
        }
      } catch ({ error, name, message }) {
        next({ error, name, message });
      }
    } else {
      res.status(401);
      next({
        error: '401',
        name: 'UnauthorizedError',
        message: 'You must be logged in to perform this action.'
      });
    }
}

module.exports = {
    getCharacterId,
    getCharacterInfo,
    getGearName,
    checkAuthorization,
    getGearList,
    jobClassIdMap
}