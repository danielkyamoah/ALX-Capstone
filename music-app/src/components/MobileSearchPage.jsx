import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { searchTracks } from "../utils/api";
import { AppContext } from "../App";

const MobileSearchPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { addSearchQueryToHistory } = useContext(AppContext);

  useEffect(() => {
    if (location.state?.initialSearchQuery) {
      setSearchQuery(location.state.initialSearchQuery);

      performSearch(location.state.initialSearchQuery);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state?.initialSearchQuery]);

  const performSearch = async (query) => {
    setError(null);
    if (!query.trim()) return;

    addSearchQueryToHistory(query); // Add search query to history

    try {
      const data = await searchTracks(query);
      setSearchResults(data);
    } catch (error) {
      console.error("Error fetching data from Deezer API:", error);
      setError("Failed to fetch music. Please try again.");
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    performSearch(searchQuery);
  };

  const handlePlayTrack = (trackId) => {
    navigate(`/track/${trackId}`);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-4 pb-16">
      <h1 className="text-4xl font-bold mb-8 text-indigo-400 md:hidden">
        Search
      </h1>

      <form onSubmit={handleSearch} className="w-full max-w-lg mb-8">
        <div className="flex items-center border-b border-indigo-500 py-2">
          <input
            className="appearance-none bg-transparent border-none w-full text-white mr-3 py-1 px-2 leading-tight focus:outline-none placeholder-gray-500"
            type="text"
            placeholder="Search for songs or artists..."
            aria-label="Search music"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            className="flex-shrink-0 bg-indigo-500 hover:bg-indigo-700 border-indigo-500 hover:border-indigo-700 text-sm border-4 text-white py-1 px-2 rounded"
            type="submit"
          >
            Search
          </button>
        </div>
      </form>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="w-full max-w-4xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
        {searchResults.length > 0 ? (
          searchResults.map((track) => (
            <div
              key={track.id}
              className="bg-gray-800 rounded-lg shadow-lg overflow-hidden cursor-pointer hover:bg-gray-700 transition-colors duration-200"
              onClick={() => handlePlayTrack(track.id)}
            >
              <img
                src={track.album.cover_medium}
                alt={track.album.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold truncate">
                  {track.title}
                </h3>
                <p className="text-sm text-gray-400 truncate">
                  {track.artist.name}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 col-span-full">
            Start searching for your favorite tunes!
          </p>
        )}
      </div>
    </div>
  );
};

export default MobileSearchPage;
