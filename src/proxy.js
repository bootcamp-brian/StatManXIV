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