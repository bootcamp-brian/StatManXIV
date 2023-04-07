const BASE_URL = 'http://localhost:3001/api';

// Users API functions
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

export const registerUser = async (username, password) => {
    const response = await fetch(`${BASE_URL}/users/register`, {
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

// Players API functions
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

export const deleteStaticMember = async (playerId, token) => {
    const response = await fetch(`${BASE_URL}/players/static`, {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ playerId })
    });

    const data = await response.json();
    return data;
}

export const editPlayerInfo = async (playerId, job, gearsetId, token) => {
    const response = await fetch(`${BASE_URL}/players/info`, {
        method: "PATCH",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ playerId, job, gearsetId })
    });

    const data = await response.json();
    return data;
}

export const manualToggleGearValue = async (playerId, updateGearPieceObj ) => {
    const response = await fetch(`${BASE_URL}/players/toggleGear`, {
        method: "PATCH",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ playerId, updateGearPieceObj })
    });

    const data = await response.json();
    return data;
}
// Statics API functions
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

export const deleteStatic = async (staticId, token) => {
    const response = await fetch(`${BASE_URL}/statics`, {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ staticId })
    });

    const data = await response.json();
    return data;
}

// Gearsets API functions
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

export const getGearSlotList = async (gearSlot, job) => {
    const response = await fetch(`${BASE_URL}/gearsets/list/${gearSlot}/${job}`, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json'
        }
    });

    const data = await response.json();
    return data;
}

export const createNewGearset = async (gearsetInfo, token) => {
    const response = await fetch(`${BASE_URL}/gearsets`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ gearsetInfo })
    });

    const data = await response.json();
    return data;
}