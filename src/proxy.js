const BASE_URL = 'http://localhost:3001/api';

export const getCharacterProxy = async (name, server) => {
    const response = await fetch(`${BASE_URL}/players/${name}/${server}`, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json'
        }
    });

    const data = await response.json();
    return data;
}

export const getStatic = async (name) => {
    const response = await fetch(`${BASE_URL}/statics/${name}/`, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json'
        }
    });

    const data = await response.json();
    return data;
}

export const syncPlayer = async (playerId) => {
    const response = await fetch(`${BASE_URL}/players/`, {
        method: "PATCH",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ playerId })
    });

    const data = await response.json();
    return data;
}

export const syncAllPlayers = async (players) => {
    const response = await fetch(`${BASE_URL}/players/static`, {
        method: "PATCH",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ players })
    });

    const data = await response.json();
    return data;
}

export const loginUser = async (username, password) => {
    const response = await fetch(`${BASE_URL}/users/login`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    });

    const data = await response.json();
    return data;
}

export const getStatics = async (token) => {
    const response = await fetch(`${BASE_URL}/users/statics`, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });

    const data = await response.json();
    return data;
}

export const getGearsets = async () => {
    const response = await fetch(`${BASE_URL}/gearsets`, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json'
        }
    });

    const data = await response.json();
    return data;
}

export const addNewMember = async ({ character, server, gearsetId, job, staticId, token }) => {
    const response = await fetch(`${BASE_URL}/players`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ character, server, gearsetId, job, staticId })
    });

    const data = await response.json();
    return data;
}

export const deleteStaticMember = async (playerId, staticId, token) => {
    const response = await fetch(`${BASE_URL}/players/static`, {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ playerId, staticId })
    });

    const data = await response.json();
    return data;
}

export const createNewStatic = async (name, token) => {
    const response = await fetch(`${BASE_URL}/statics`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name })
    });

    const data = await response.json();
    return data;
}

export const getGearSlotList = async (gearSlot) => {
    console.log(gearSlot)
    const response = await fetch(`${BASE_URL}/gearsets/list/${gearSlot}`, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json'
        }
    });

    const data = await response.json();
    return data;
}