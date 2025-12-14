import { useState, useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { searchTracks, getCharts } from "./utils/api";
import SongDetailPage from "./components/SongDetailPage";

function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState(null);
  const [charts, setCharts] = useState([]);
  const [chartsLoading, setChartsLoading] = useState(true);
  const [chartsError, setChartsError] = useState(null);
  const [recentlyPlayedTracks, setRecentlyPlayedTracks] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchCharts = async () => {
      try {
        setChartsLoading(true);
        const chartData = await getCharts();
        // Assuming 'charts' endpoint returns an object with a 'tracks' array
        setCharts(chartData.tracks.data);
      } catch (err) {
        console.error("Error fetching charts:", err);
        setChartsError("Failed to load charts. Please try again.");
      } finally {
        setChartsLoading(false);
      }
    };

    fetchCharts();

    try {
      const stored =
        JSON.parse(localStorage.getItem("recentlyPlayedTracks")) || [];
      setRecentlyPlayedTracks(stored);
    } catch (e) {
      console.error(
        "Failed to load recently played tracks from local storage:",
        e
      );
    }
  }, []); // Run once on component mount

  const handleSearch = async (e) => {
    e.preventDefault();
    setError(null); // Clear previous search errors
    if (!searchQuery.trim()) return;

    try {
      const data = await searchTracks(searchQuery);
      setSearchResults(data);
    } catch (error) {
      console.error("Error fetching data from Deezer API:", error);
      setError("Failed to fetch music. Please try again.");
    }
  };

  const handlePlayTrack = (trackId) => {
    navigate(`/track/${trackId}`);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-4">
      {/* Header */}
      <h1 className="text-4xl font-bold mb-8 text-indigo-400">Music Player</h1>

      <Routes>
        <Route
          path="/"
          element={
            <>
              {/* Search Bar */}
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

              {/* Global Charts Section */}
              {chartsLoading ? (
                <p className="text-center text-gray-500 mb-8">
                  Loading charts...
                </p>
              ) : chartsError ? (
                <p className="text-center text-red-500 mb-8">{chartsError}</p>
              ) : (
                charts.length > 0 && (
                  <section className="w-full max-w-4xl mb-12">
                    <h2 className="text-3xl font-bold mb-6 text-indigo-300">
                      Global Charts
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                      {charts.map((track) => (
                        <div
                          key={track.id}
                          className="bg-gray-800 rounded-lg shadow-lg overflow-hidden cursor-pointer hover:bg-gray-700 transition-colors duration-200"
                          onClick={() => handlePlayTrack(track.id)}
                        >
                          <img
                            src={track.album.cover_medium}
                            alt={track.album.title}
                            className="w-full h-auto object-cover"
                          />
                          <div className="p-3 text-sm">
                            <h3 className="font-semibold truncate">
                              {track.title}
                            </h3>
                            <p className="text-gray-400 truncate">
                              {track.artist.name}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                )
              )}

              {/* Recently Played Section */}
              {recentlyPlayedTracks.length > 0 && (
                <section className="w-full max-w-4xl mb-12">
                  <h2 className="text-3xl font-bold mb-6 text-indigo-300">
                    Recently Played
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {recentlyPlayedTracks.map((track) => (
                      <div
                        key={track.id}
                        className="bg-gray-800 rounded-lg shadow-lg overflow-hidden cursor-pointer hover:bg-gray-700 transition-colors duration-200"
                        onClick={() => handlePlayTrack(track.id)}
                      >
                        <img
                          src={track.album.cover_medium}
                          alt={track.album.title}
                          className="w-full h-auto object-cover"
                        />
                        <div className="p-3 text-sm">
                          <h3 className="font-semibold truncate">
                            {track.title}
                          </h3>
                          <p className="text-gray-400 truncate">
                            {track.artist.name}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Search Results */}
              {searchResults.length > 0 && (
                <section className="w-full max-w-4xl">
                  <h2 className="text-3xl font-bold mb-6 text-indigo-300">
                    Search Results
                  </h2>
                  <div className="w-full max-w-4xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
                    {searchResults.map((track) => (
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
                    ))}
                  </div>
                </section>
              )}

              {!chartsLoading &&
                charts.length === 0 &&
                searchResults.length === 0 &&
                recentlyPlayedTracks.length === 0 &&
                !chartsError &&
                !error && (
                  <p className="text-center text-gray-500 col-span-full">
                    Start by searching for a song or browse the charts or your
                    recently played tracks!
                  </p>
                )}
            </>
          }
        />
        <Route path="/track/:id" element={<SongDetailPage />} />
      </Routes>
    </div>
  );
}

export default App;
