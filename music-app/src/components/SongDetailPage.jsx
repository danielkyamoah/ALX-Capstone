import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getTrackById } from "../utils/api";
import { AppContext } from "../App"; // Import AppContext

const SongDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [track, setTrack] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addTrackToRecentlyPlayed } = useContext(AppContext); // Use useContext to get the function

  useEffect(() => {
    const fetchTrack = async () => {
      try {
        setLoading(true);
        const trackData = await getTrackById(id);
        setTrack(trackData);
        addTrackToRecentlyPlayed(trackData); // Add track to recently played
      } catch (err) {
        console.error("Failed to fetch track details:", err);
        setError("Could not load song details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchTrack();
  }, [id, addTrackToRecentlyPlayed]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#DBF9F4] text-[#0A3200] flex items-center justify-center">
        <p className="text-xl">Loading song...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#DBF9F4] text-[#0A3200] flex items-center justify-center flex-col p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
          <div className="text-red-500 mb-4">
            <svg className="mx-auto h-12 w-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <h2 className="text-lg font-semibold mb-2">Unable to Load Song</h2>
            <p className="text-sm">{error}</p>
          </div>
          <div className="flex gap-2 justify-center">
            <button
              onClick={() => navigate(-1)}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded transition-colors duration-200"
            >
              Go Back
            </button>
            <button
              onClick={() => navigate("/")}
              className="bg-[#FF9FB2] hover:bg-[#F0C808] text-white px-4 py-2 rounded transition-colors duration-200"
            >
              Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!track) {
    return (
      <div className="min-h-screen bg-[#DBF9F4] text-[#0A3200] flex items-center justify-center">
        <p className="text-xl">Song not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#DBF9F4] text-[#0A3200] flex flex-col items-center justify-center p-4">
      <div className="absolute top-4 left-4 flex gap-2">
        <button
          onClick={() => navigate(-1)}
          className="bg-[#6773D2] hover:bg-[#F0C808] text-white p-2 rounded-full flex items-center justify-center transition-colors duration-200 shadow-md cursor-pointer"
          aria-label="Go back"
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
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
        </button>
        <button
          onClick={() => navigate("/")}
          className="bg-[#FF9FB2] hover:bg-[#F0C808] text-white p-2 rounded-full flex items-center justify-center transition-colors duration-200 shadow-md cursor-pointer"
          aria-label="Go home"
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
              d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"
            />
          </svg>
        </button>
      </div>
      <div className="max-w-xl w-full bg-white rounded-lg shadow-lg overflow-hidden p-6 text-center">
        <img
          src={track.album?.cover_xl || track.album?.cover_medium}
          alt={track.title}
          className="w-64 h-64 object-cover rounded-lg mx-auto mb-6 shadow-md"
        />
        <h2 className="text-3xl font-bold mb-2 text-[#6773D2]">{track.title}</h2>
        <p className="text-xl text-[#0A3200] mb-4">{track.artist?.name}</p>
        <p className="text-md text-[#0A3200] mb-6">
          Album: {track.album?.title}
        </p>

        {track.preview ? (
          <div className="w-full max-w-md mx-auto bg-[#DBF9F4] rounded-lg p-2 shadow-inner border border-[#FF9FB2]">
            <audio
              controls
              autoPlay
              src={track.preview}
              className="w-full bg-[#DBF9F4] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9FB2]"
            >
              Your browser does not support the audio element.
            </audio>
          </div>
        ) : (
          <p className="text-red-400">No preview available for this track.</p>
        )}
      </div>
    </div>
  );
};

export default SongDetailPage;
