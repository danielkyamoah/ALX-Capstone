import { useState, useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { getCharts } from "./utils/api";
import SongDetailPage from "./components/SongDetailPage";
import MobileNavbar from "./components/MobileNavbar";
import MobileSearchPage from "./components/MobileSearchPage";

function App() {
  const [error, setError] = useState(null); // Keep a general error state for the App component
  const [charts, setCharts] = useState([]);
  const [chartsLoading, setChartsLoading] = useState(true);
  const [chartsError, setChartsError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

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
  }, []); // Run once on component mount

  const handlePlayTrack = (trackId) => {
    navigate(`/track/${trackId}`);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-4 pb-16 sm:pb-4">
      {/* Header */}
      <h1 className="text-4xl font-bold mb-8 text-indigo-400">Music Player</h1>

      <Routes>
        <Route
          path="/"
          element={
            <>
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
      {location.pathname === "/" && <MobileNavbar />}
    </div>
  );
}

export default App;
