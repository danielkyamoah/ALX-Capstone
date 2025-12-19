import { useState, useEffect, useCallback, createContext } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { getCharts } from "./utils/api";
import SongDetailPage from "./components/SongDetailPage";
import MobileNavbar from "./components/MobileNavbar";
import MobileSearchPage from "./components/MobileSearchPage";
import HistoryDisplay from "./components/HistoryDisplay";

export const AppContext = createContext(null);

function App() {
  const [error, setError] = useState(null);
  const [charts, setCharts] = useState([]);
  const [chartsLoading, setChartsLoading] = useState(true);
  const [chartsError, setChartsError] = useState(null);
  const [showQuickSearchBar, setShowQuickSearchBar] = useState(false);
  const [quickSearchQuery, setQuickSearchQuery] = useState("");
  const [recentlyPlayedTracks, setRecentlyPlayedTracks] = useState(() => {
    try {
      const storedTracks = localStorage.getItem("recentlyPlayedTracks");
      return storedTracks ? JSON.parse(storedTracks) : [];
    } catch (e) {
      console.error(
        "Failed to load recently played tracks from localStorage",
        e
      );
      return [];
    }
  });
  const [searchHistory, setSearchHistory] = useState(() => {
    try {
      const storedSearches = localStorage.getItem("searchHistory");
      return storedSearches ? JSON.parse(storedSearches) : [];
    } catch (e) {
      console.error("Failed to load search history from localStorage", e);
      return [];
    }
  });

  const navigate = useNavigate();
  const location = useLocation();

  // Persist recentlyPlayedTracks to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(
        "recentlyPlayedTracks",
        JSON.stringify(recentlyPlayedTracks)
      );
    } catch (e) {
      console.error("Failed to save recently played tracks to localStorage", e);
    }
  }, [recentlyPlayedTracks]);

  // Persist searchHistory to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
    } catch (e) {
      console.error("Failed to save search history to localStorage", e);
    }
  }, [searchHistory]);

  const addTrackToRecentlyPlayed = useCallback((track) => {
    setRecentlyPlayedTracks((prevTracks) => {
      const newTracks = [track, ...prevTracks].slice(0, 10); // Keep last 10 tracks
      return newTracks.filter(
        (t, index, self) => index === self.findIndex((_t) => _t.id === t.id)
      ); // Remove duplicates
    });
  }, []);

  const addSearchQueryToHistory = useCallback((query) => {
    setSearchHistory((prevSearches) => {
      const newSearches = [query, ...prevSearches].slice(0, 10); // Keep last 10 searches
      return newSearches.filter((s, index, self) => index === self.indexOf(s)); // Remove duplicates
    });
  }, []);

  useEffect(() => {
    const fetchCharts = async () => {
      try {
        setChartsLoading(true);
        const chartData = await getCharts();
        setCharts(chartData.tracks.data);
      } catch (err) {
        console.error("Error fetching charts:", err);
        setChartsError("Failed to load charts. Please try again.");
      } finally {
        setChartsLoading(false);
      }
    };

    fetchCharts();
  }, []);

  const handlePlayTrack = (trackId) => {
    navigate(`/track/${trackId}`);
  };

  const handleQuickSearch = (e) => {
    e.preventDefault();
    if (quickSearchQuery.trim()) {
      navigate("/search", { state: { initialSearchQuery: quickSearchQuery } });
      setQuickSearchQuery("");
      setShowQuickSearchBar(false);
    }
  };

  return (
    <AppContext.Provider
      value={{ addTrackToRecentlyPlayed, addSearchQueryToHistory }}
    >
      <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-4 pb-16 sm:pb-4">
        <h1 className="text-4xl font-bold mb-8 text-blue-500">Music Player</h1>

        <Routes>
          <Route
            path="/"
            element={
              <>
                <div className="w-full max-w-4xl flex justify-end mb-4 md:hidden">
                  <button
                    onClick={() => setShowQuickSearchBar(!showQuickSearchBar)}
                    className="p-2 rounded-full bg-gray-700 hover:bg-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                    aria-label="Toggle search bar"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </button>
                </div>
                <form
                  onSubmit={handleQuickSearch}
                  className={`w-full max-w-lg mb-8 transition-all duration-300 ease-in-out overflow-hidden md:max-h-screen md:overflow-visible ${
                    showQuickSearchBar ? "max-h-screen" : "max-h-0"
                  }`}
                >
                  <div className="flex items-center border-b border-blue-500 py-2">
                    <input
                      className="appearance-none bg-transparent border-none w-full text-white mr-3 py-1 px-2 leading-tight focus:outline-none placeholder-gray-500"
                      type="text"
                      placeholder="Quick search..."
                      aria-label="Quick search music"
                      value={quickSearchQuery}
                      onChange={(e) => setQuickSearchQuery(e.target.value)}
                    />
                    <button
                      className="flex-shrink-0 bg-blue-500 hover:bg-blue-700 border-blue-500 hover:border-blue-700 text-sm border-4 text-white py-1 px-2 rounded cursor-pointer"
                      type="submit"
                    >
                      Search
                    </button>
                  </div>
                </form>
                {chartsLoading ? (
                  <p className="text-center text-gray-500 mb-8">
                    Loading charts...
                  </p>
                ) : chartsError ? (
                  <p className="text-center text-red-500 mb-8">{chartsError}</p>
                ) : (
                  charts.length > 0 && (
                    <section className="w-full max-w-4xl mb-12">
                      <h2 className="text-3xl font-bold mb-6 text-blue-300">
                        Global Charts
                      </h2>
                      <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
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
                <HistoryDisplay
                  title="Recently Played"
                  items={recentlyPlayedTracks}
                  type="tracks"
                  onClear={() => setRecentlyPlayedTracks([])}
                />
                <HistoryDisplay
                  title="Recent Searches"
                  items={searchHistory}
                  type="searches"
                  onClear={() => setSearchHistory([])}
                />
                {!chartsLoading &&
                  charts.length === 0 &&
                  !chartsError &&
                  !error && (
                    <p className="text-center text-gray-500 col-span-full">
                      No charts available. Try the search page!
                    </p>
                  )}
              </>
            }
          />
          <Route path="/search" element={<MobileSearchPage />} />
          <Route path="/track/:id" element={<SongDetailPage />} />
        </Routes>
        {(location.pathname === "/" || location.pathname === "/search") && (
          <MobileNavbar />
        )}
      </div>
    </AppContext.Provider>
  );
}

export default App;
