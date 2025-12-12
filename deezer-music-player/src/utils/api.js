// utils/api.js

/**
 * Search for tracks by query string
 * @param {string} q - Search query
 * @returns {Promise<Array>} Array of track objects or empty array on error
 */
export const searchTracks = async (q) => {
    // Try normal fetch first, but if blocked by CORS fall back to JSONP.
    const url = `https://api.deezer.com/search?q=${encodeURIComponent(q)}`;
    try {
        const res = await fetch(url);
        if (!res.ok) {
            const statusText = res.status === 0 ? 'CORS blocked' : `HTTP ${res.status}`;
            throw new Error(`Failed to search: ${statusText}`);
        }
        const data = await res.json();
        return data.data || [];
    } catch (error) {
        // If fetch failed due to CORS or network, attempt JSONP fallback
        console.warn('Fetch failed, attempting JSONP fallback:', error.message);
        try {
            const jsonpData = await jsonpFetch(`${url}&output=jsonp`);
            return jsonpData.data || [];
        } catch (jsonpErr) {
            console.error('JSONP fallback failed:', jsonpErr.message);
            if (error instanceof TypeError) {
                throw new Error('Unable to connect to music service. Please check your internet connection or try again later.');
            }
            throw jsonpErr;
        }
    }
};

/**
 * Get a single track by ID
 * @param {string|number} id - Track ID
 * @returns {Promise<Object>} Track object
 */
export const getTrackById = async (id) => {
    const url = `https://api.deezer.com/track/${id}`;
    try {
        const res = await fetch(url);
        if (!res.ok) {
            const statusText = res.status === 0 ? 'CORS blocked' : `HTTP ${res.status}`;
            throw new Error(`Failed to fetch track: ${statusText}`);
        }
        return await res.json();
    } catch (error) {
        // Try JSONP fallback
        console.warn('Fetch failed for track, attempting JSONP fallback:', error.message);
        try {
            const jsonpData = await jsonpFetch(`${url}?output=jsonp`);
            return jsonpData || null;
        } catch (jsonpErr) {
            console.error('JSONP fallback failed for track:', jsonpErr.message);
            if (error instanceof TypeError) {
                throw new Error('Unable to connect to music service. Please check your internet connection or try again later.');
            }
            throw jsonpErr;
        }
    }
};

// JSONP helper used as a CORS fallback for Deezer public API
function jsonpFetch(url, timeout = 8000) {
    return new Promise((resolve, reject) => {
        if (typeof window === 'undefined') return reject(new Error('JSONP not available in this environment'));
        const callbackName = `__deezer_jsonp_cb_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
        const separator = url.includes('?') ? '&' : '?';
        const src = `${url}${separator}callback=${callbackName}`;

        const script = document.createElement('script');
        let timer = null;

        window[callbackName] = (data) => {
            clearTimeout(timer);
            cleanup();
            resolve(data);
        };

        function cleanup() {
            try { delete window[callbackName]; } catch (e) { window[callbackName] = undefined; }
            if (script.parentNode) script.parentNode.removeChild(script);
        }

        script.src = src;
        script.onerror = () => {
            clearTimeout(timer);
            cleanup();
            reject(new Error('JSONP script error'));
        };

        document.head.appendChild(script);
        timer = setTimeout(() => {
            cleanup();
            reject(new Error('JSONP request timed out'));
        }, timeout);
    });
}
