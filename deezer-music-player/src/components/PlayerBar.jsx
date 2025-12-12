import {
  FiPlay,
  FiPause,
  FiSkipBack,
  FiSkipForward,
  FiVolume2,
} from "react-icons/fi";

export default function PlayerBar({
  currentTrack,
  isPlaying,
  progress,
  duration,
  onPlayPause,
  onPrev,
  onNext,
  onSeek,
  volume,
  setVolume,
}) {
  if (!currentTrack) {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white p-4 pb-safe text-center text-sm">
        Select a track to play
      </div>
    );
  }

  const formatTime = (sec) => {
    if (!sec || isNaN(sec)) return "0:00";
    const mins = Math.floor(sec / 60);
    const secs = Math.floor(sec % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white pb-safe shadow-2xl border-t border-gray-800">
      <div className="max-w-5xl mx-auto p-3 md:p-4">
        {/* Track info */}
        <div className="mb-3 px-1">
          <p className="font-semibold text-sm md:text-base truncate">
            {currentTrack.title}
          </p>
          <p className="text-xs text-gray-400 truncate">
            {currentTrack.artist?.name || "Unknown Artist"}
          </p>
        </div>

        {/* Progress bar */}
        <div className="mb-4 flex items-center gap-3 px-1">
          <span className="text-xs w-10 md:w-12 text-right text-gray-300">
            {formatTime(progress)}
          </span>
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={progress || 0}
            onChange={(e) => onSeek(parseFloat(e.target.value))}
            className="flex-1 h-2 bg-gray-700 rounded-lg cursor-pointer appearance-none slider"
          />
          <span className="text-xs w-10 md:w-12 text-gray-300">
            {formatTime(duration)}
          </span>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2 md:gap-4">
            <button
              onClick={onPrev}
              className="p-3 md:p-2 hover:bg-gray-800 rounded-full transition-colors touch-manipulation"
              title="Previous"
            >
              <FiSkipBack size={20} />
            </button>

            <button
              onClick={onPlayPause}
              className="p-4 md:p-3 bg-blue-600 hover:bg-blue-700 rounded-full transition-colors shadow-lg"
              title={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <FiPause size={24} className="md:w-5 md:h-5" />
              ) : (
                <FiPlay size={24} className="md:w-5 md:h-5 ml-0.5" />
              )}
            </button>

            <button
              onClick={onNext}
              className="p-3 md:p-2 hover:bg-gray-800 rounded-full transition-colors touch-manipulation"
              title="Next"
            >
              <FiSkipForward size={20} />
            </button>
          </div>

          {/* Volume - Hidden on small screens, shown on md+ */}
          <div className="hidden md:flex items-center gap-2">
            <FiVolume2 size={18} />
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-20 h-1 bg-gray-700 rounded cursor-pointer appearance-none slider"
            />
          </div>

          {/* Volume button for mobile */}
          <button
            className="md:hidden p-3 hover:bg-gray-800 rounded-full transition-colors touch-manipulation"
            title="Volume"
          >
            <FiVolume2 size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
