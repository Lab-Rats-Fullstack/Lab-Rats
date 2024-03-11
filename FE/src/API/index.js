const API = "http://localhost:3000/api";

export async function getTags() {
        try {
            const response = await fetch (`${API}/tags/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            const result = await response.json();
            return result;
        } catch (error) {
            console.error(error);
        }
    };