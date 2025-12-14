// utils/api.js

/**
 * Search for tracks by query string
 * @param {string} q - Search query
 * @returns {Promise<Array>} Array of track objects or empty array on error
 */
export const searchTracks = async (q) => {
    try {
        const url = `https://api.deezer.com/search?q=${encodeURIComponent(q)}`;
        const res = await fetch(url);

        if (!res.ok) {
            const statusText = res.status === 0 ? 'CORS blocked' : `HTTP ${res.status}`;
            throw new Error(`Failed to search: ${statusText}`);
        }

        const data = await res.json();
        return data.data || [];
    } catch (error) {
        if (error instanceof TypeError) {
            console.error('Network error (CORS or offline):', error.message);
            throw new Error('Unable to connect to music service. Please check your internet connection or try again later.');
        }
        if (error instanceof SyntaxError) {
            console.error('Invalid response format:', error.message);
            throw new Error('Received invalid data from music service. Please try again.');
        }
        console.error('Search error:', error.message);
        throw error;
    }
};

/**
 * Get a single track by ID
 * @param {string|number} id - Track ID
 * @returns {Promise<Object>} Track object
 */
export const getTrackById = async (id) => {
    try {
        const url = `https://api.deezer.com/track/${id}`;
        const res = await fetch(url);

        if (!res.ok) {
            const statusText = res.status === 0 ? 'CORS blocked' : `HTTP ${res.status}`;
            throw new Error(`Failed to fetch track: ${statusText}`);
        }

        return await res.json();
    } catch (error) {
        if (error instanceof TypeError) {
            console.error('Network error (CORS or offline):', error.message);
            throw new Error('Unable to connect to music service. Please check your internet connection or try again later.');
        }
        if (error instanceof SyntaxError) {
            console.error('Invalid response format:', error.message);
            throw new Error('Received invalid data from music service. Please try again.');
        }
        console.error('Track fetch error:', error.message);
        throw error;
    }
};
