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
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <p className="text-xl">Loading song...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center flex-col">
        <p className="text-xl text-red-500 mb-4">{error}</p>
        <button
          onClick={() => navigate("/")}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer"
        >
          Go Back Home
        </button>
      </div>
    );
  }

  if (!track) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <p className="text-xl">Song not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
      <button
        onClick={() => navigate(-1)}
        className="absolute top-4 left-4 bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-full flex items-center justify-center transition-colors duration-200 shadow-md cursor-pointer"
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
      <div className="max-w-xl w-full bg-gray-800 rounded-lg shadow-lg overflow-hidden p-6 text-center">
        <img
          src={track.album?.cover_xl || track.album?.cover_medium}
          alt={track.title}
          className="w-64 h-64 object-cover rounded-lg mx-auto mb-6 shadow-md"
        />
        <h2 className="text-3xl font-bold mb-2 text-blue-400">{track.title}</h2>
        <p className="text-xl text-gray-300 mb-4">{track.artist?.name}</p>
        <p className="text-md text-gray-400 mb-6">
          Album: {track.album?.title}
        </p>

        {track.preview ? (
          <div className="w-full max-w-md mx-auto bg-gray-700 rounded-lg p-2 shadow-inner">
            <audio
              controls
              autoPlay
              src={track.preview}
              className="w-full bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
