// Input validation utility
const validateSearchQuery = (query) => {
  if (!query || typeof query !== 'string') {
    throw new Error('Search query is required and must be a valid string.');
  }

  const trimmed = query.trim();
  if (trimmed.length === 0) {
    throw new Error('Search query cannot be empty.');
  }

  if (trimmed.length < 2) {
    throw new Error('Search query must be at least 2 characters long.');
  }

  if (trimmed.length > 100) {
    throw new Error('Search query is too long. Please use 100 characters or less.');
  }

  // Check for potentially harmful characters
  const harmfulChars = /[<>\"';&]/;
  if (harmfulChars.test(trimmed)) {
    throw new Error('Search query contains invalid characters.');
  }

  return trimmed;
};

// Network connectivity check
const checkNetworkConnectivity = async () => {
  if (!navigator.onLine) {
    throw new Error('You appear to be offline. Please check your internet connection.');
  }

  try {
    // Try a quick connection test
    await fetch('/api/chart', {
      method: 'HEAD',
      signal: AbortSignal.timeout(5000)
    });
  } catch (error) {
    if (error.name === 'TimeoutError') {
      throw new Error('Connection is slow. Please check your internet connection.');
    }
    throw new Error('Unable to connect to the music service. Please try again later.');
  }
};

// Retry mechanism for failed requests
const retryRequest = async (fn, maxRetries = 3, delay = 1000) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      const isLastAttempt = attempt === maxRetries;
      const isRetryableError = error.message.includes('fetch') ||
        error.message.includes('network') ||
        error.message.includes('timeout') ||
        error.status >= 500;

      if (isLastAttempt || !isRetryableError) {
        throw error;
      }

      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay * attempt));
    }
  }
};

export const searchTracks = async (q) => {
  try {
    // Validate input
    const validatedQuery = validateSearchQuery(q);

    // Check network connectivity
    await checkNetworkConnectivity();

    const result = await retryRequest(async () => {
      const url = `/api/search?q=${encodeURIComponent(validatedQuery)}`;
      const res = await fetch(url, {
        signal: AbortSignal.timeout(10000) // 10 second timeout
      });

      if (!res.ok) {
        let errorMessage = `Search failed with status ${res.status}`;

        switch (res.status) {
          case 400:
            errorMessage = 'Invalid search query. Please try different keywords.';
            break;
          case 401:
            errorMessage = 'Authentication failed. Please refresh the page.';
            break;
          case 403:
            errorMessage = 'Access denied. Please try again later.';
            break;
          case 404:
            errorMessage = 'Search service not found. Please try again later.';
            break;
          case 429:
            errorMessage = 'Too many requests. Please wait a moment and try again.';
            break;
          case 500:
          case 502:
          case 503:
          case 504:
            errorMessage = 'Music service is temporarily unavailable. Please try again later.';
            break;
          default:
            errorMessage = `Search failed (Error ${res.status}). Please try again.`;
        }

        throw new Error(errorMessage);
      }

      const data = await res.json();

      // Validate response structure
      if (!data || typeof data !== 'object') {
        throw new Error('Invalid response from music service. Please try again.');
      }

      // Check if we have the expected data structure
      if (!data.data || !Array.isArray(data.data)) {
        console.warn('Unexpected API response structure:', data);
        return [];
      }

      return data.data;
    });

    return result;

  } catch (error) {
    // Handle different error types
    if (error.message.includes('timeout') || error.name === 'TimeoutError') {
      throw new Error('Search request timed out. Please check your connection and try again.');
    }

    if (error.message.includes('network') || error.message.includes('fetch')) {
      throw new Error('Network error occurred. Please check your internet connection.');
    }

    if (error.message.includes('CORS') || error.message.includes('blocked')) {
      throw new Error('Connection blocked. Please try refreshing the page.');
    }

    if (error.message.includes('JSON')) {
      throw new Error('Invalid response from music service. Please try again.');
    }

    // Re-throw custom error messages as-is
    throw error;
  }
};

// Validate track ID
const validateTrackId = (id) => {
  if (!id) {
    throw new Error('Track ID is required.');
  }

  // Convert to string and trim
  const idStr = String(id).trim();

  if (idStr.length === 0) {
    throw new Error('Track ID cannot be empty.');
  }

  // Check if it's a valid number (most track IDs are numeric)
  if (isNaN(idStr) || !Number.isInteger(Number(idStr))) {
    throw new Error('Invalid track ID format.');
  }

  // Check for reasonable length
  if (idStr.length > 20) {
    throw new Error('Track ID is too long.');
  }

  return idStr;
};

export const getTrackById = async (id) => {
  try {
    // Validate input
    const validatedId = validateTrackId(id);

    // Check network connectivity
    await checkNetworkConnectivity();

    const result = await retryRequest(async () => {
      const url = `/api/track/${validatedId}`;
      const res = await fetch(url, {
        signal: AbortSignal.timeout(10000) // 10 second timeout
      });

      if (!res.ok) {
        let errorMessage = `Failed to load track (Error ${res.status})`;

        switch (res.status) {
          case 400:
            errorMessage = 'Invalid track request. Please try again.';
            break;
          case 401:
            errorMessage = 'Authentication failed. Please refresh the page.';
            break;
          case 403:
            errorMessage = 'Access denied to this track.';
            break;
          case 404:
            errorMessage = 'Track not found. It may have been removed or the ID is incorrect.';
            break;
          case 429:
            errorMessage = 'Too many requests. Please wait a moment and try again.';
            break;
          case 500:
          case 502:
          case 503:
          case 504:
            errorMessage = 'Music service is temporarily unavailable. Please try again later.';
            break;
          default:
            errorMessage = `Failed to load track (Error ${res.status}). Please try again.`;
        }

        throw new Error(errorMessage);
      }

      const trackData = await res.json();

      // Validate track data structure
      if (!trackData || typeof trackData !== 'object') {
        throw new Error('Invalid track data received. Please try again.');
      }

      // Check for required fields
      if (!trackData.id) {
        throw new Error('Track data is incomplete. Please try again.');
      }

      if (!trackData.title || !trackData.artist) {
        console.warn('Track data missing title or artist:', trackData);
      }

      return trackData;
    });

    return result;

  } catch (error) {
    // Handle different error types
    if (error.message.includes('timeout') || error.name === 'TimeoutError') {
      throw new Error('Track loading timed out. Please check your connection and try again.');
    }

    if (error.message.includes('network') || error.message.includes('fetch')) {
      throw new Error('Network error occurred. Please check your internet connection.');
    }

    if (error.message.includes('CORS') || error.message.includes('blocked')) {
      throw new Error('Connection blocked. Please try refreshing the page.');
    }

    if (error.message.includes('JSON')) {
      throw new Error('Invalid track data received. Please try again.');
    }

    // Re-throw custom error messages as-is
    throw error;
  }
};

export const getCharts = async () => {
  try {
    // Check network connectivity
    await checkNetworkConnectivity();

    const result = await retryRequest(async () => {
      const url = `/api/chart`;
      const res = await fetch(url, {
        signal: AbortSignal.timeout(10000) // 10 second timeout
      });

      if (!res.ok) {
        let errorMessage = `Failed to load charts (Error ${res.status})`;

        switch (res.status) {
          case 401:
            errorMessage = 'Authentication failed. Please refresh the page.';
            break;
          case 403:
            errorMessage = 'Access denied to charts.';
            break;
          case 404:
            errorMessage = 'Charts service not available. Please try again later.';
            break;
          case 429:
            errorMessage = 'Too many requests. Please wait a moment and try again.';
            break;
          case 500:
          case 502:
          case 503:
          case 504:
            errorMessage = 'Music service is temporarily unavailable. Please try again later.';
            break;
          default:
            errorMessage = `Failed to load charts (Error ${res.status}). Please try again.`;
        }

        throw new Error(errorMessage);
      }

      const chartData = await res.json();

      // Validate chart data structure
      if (!chartData || typeof chartData !== 'object') {
        throw new Error('Invalid chart data received. Please try again.');
      }

      // Check for expected structure
      if (!chartData.tracks || !Array.isArray(chartData.tracks.data)) {
        console.warn('Unexpected chart data structure:', chartData);
        // Return a safe fallback structure
        return { tracks: { data: [] } };
      }

      return chartData;
    });

    return result;

  } catch (error) {
    // Handle different error types
    if (error.message.includes('timeout') || error.name === 'TimeoutError') {
      throw new Error('Chart loading timed out. Please check your connection and try again.');
    }

    if (error.message.includes('network') || error.message.includes('fetch')) {
      throw new Error('Network error occurred. Please check your internet connection.');
    }

    if (error.message.includes('CORS') || error.message.includes('blocked')) {
      throw new Error('Connection blocked. Please try refreshing the page.');
    }

    if (error.message.includes('JSON')) {
      throw new Error('Invalid chart data received. Please try again.');
    }

    // Re-throw custom error messages as-is
    throw error;
  }
};
