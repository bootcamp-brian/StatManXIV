const fetch = require('node-fetch');

const BASE_URL = 'https://xivapi.com';

const getCharacterId = async (name, server) => {
    const response = await fetch(`${BASE_URL}/character/search?name=${name}&server=${server}`, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json'
        }
    });

    const data = await response.json();
    return data.Results[0].ID;
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

module.exports = {
    getCharacterId,
    getCharacterInfo,
    getGearName
}