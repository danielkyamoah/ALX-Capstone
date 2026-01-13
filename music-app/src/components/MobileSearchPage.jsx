import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { searchTracks } from "../utils/api";
import { AppContext } from "../App";

const MobileSearchPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [inputError, setInputError] = useState(null);
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
    setInputError(null);

    const trimmedQuery = query.trim();

    // Client-side input validation before API call
    if (!trimmedQuery) {
      setInputError("Please enter a search term.");
      return;
    }

    if (trimmedQuery.length < 2) {
      setInputError("Search term must be at least 2 characters long.");
      return;
    }

    if (trimmedQuery.length > 100) {
      setInputError(
        "Search term is too long. Please use 100 characters or less."
      );
      return;
    }

    // Check for potentially harmful characters
    const harmfulChars = /[<>\"';&]/;
    if (harmfulChars.test(trimmedQuery)) {
      setInputError(
        "Search term contains invalid characters. Please use only letters, numbers, and spaces."
      );
      return;
    }

    addSearchQueryToHistory(trimmedQuery); // Add search query to history

    setIsLoading(true);
    try {
      const data = await searchTracks(trimmedQuery);
      setSearchResults(data);

      // Show message if no results found
      if (data.length === 0) {
        setError(
          `No results found for "${trimmedQuery}". Try different keywords or check your spelling.`
        );
      }
    } catch (error) {
      console.error("Error fetching data from Deezer API:", error);
      setError(
        error.message || "Failed to search for music. Please try again."
      );
      setSearchResults([]); // Clear results on error
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    await performSearch(searchQuery);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    // Clear input error when user starts typing
    if (inputError) {
      setInputError(null);
    }

    // Clear general error when user modifies search
    if (error && value.trim() !== searchQuery.trim()) {
      setError(null);
    }
  };

  const handlePlayTrack = (trackId) => {
    navigate(`/track/${trackId}`);
  };

  return (
    <div className="min-h-screen bg-[#DBF9F4] text-[#0A3200] flex flex-col items-center p-4 pb-16">
      <h1 className="text-4xl font-bold mb-8 text-[#6773D2] md:hidden">
        Search
      </h1>

      <form onSubmit={handleSearch} className="w-full max-w-lg mb-8">
        <div className="flex items-center border-b border-[#FF9FB2] py-2">
          <input
            className={`appearance-none bg-transparent border-none w-full text-[#0A3200] mr-3 py-1 px-2 leading-tight focus:outline-none placeholder-gray-500 ${
              inputError ? "border-red-400 border-b" : ""
            }`}
            type="text"
            placeholder="Search for songs or artists..."
            aria-label="Search music"
            value={searchQuery}
            onChange={handleInputChange}
            maxLength={100}
            disabled={isLoading}
          />
          <button
            className="flex-shrink-0 bg-[#FF9FB2] hover:bg-[#F0C808] disabled:bg-gray-400 disabled:cursor-not-allowed border-[#FF9FB2] hover:border-[#F0C808] text-white py-1 px-2 rounded transition-colors duration-200"
            type="submit"
            disabled={isLoading || !searchQuery.trim()}
          >
            {isLoading ? "Searching..." : "Search"}
          </button>
        </div>
      </form>

      {inputError && <p className="text-red-500 mb-4 text-sm">{inputError}</p>}
      {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}
      {isLoading && (
        <p className="text-[#6773D2] mb-4 text-sm">Searching for music...</p>
      )}

      <div className="w-full max-w-4xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
        {searchResults.length > 0 ? (
          searchResults.map((track) => (
            <div
              key={track.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer hover:bg-[#FF9FB2] transition-colors duration-200"
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
                <p className="text-sm text-[#0A3200] truncate">
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
