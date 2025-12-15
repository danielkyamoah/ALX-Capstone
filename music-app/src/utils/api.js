export const searchTracks = async (q) => {
  try {
    const url = `/api/search?q=${encodeURIComponent(q)}`;
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

export const getTrackById = async (id) => {
  try {
    const url = `/api/track/${id}`;
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

export const getCharts = async () => {
  try {
    const url = `/api/chart`;
    const res = await fetch(url);

    if (!res.ok) {
      const statusText = res.status === 0 ? 'CORS blocked' : `HTTP ${res.status}`;
      throw new Error(`Failed to fetch charts: ${statusText}`);
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
    console.error('Charts fetch error:', error.message);
    throw error;
  }
};
