import { useEffect, useState } from "react";
import "./App.css";
import SearchBar from "./components/SearchBar";
import TrackList from "./components/TrackList";
import PlayerBar from "./components/PlayerBar";
import LoadingSpinner from "./components/LoadingSpinner";
import ErrorBanner from "./components/ErrorBanner";
import useDebouncedValue from "./hooks/useDebounedValue";
import useAudioPlayer from "./hooks/useAudioPlayer";
import { searchTracks } from "./utils/api";

function App() {
  const [query, setQuery] = useState("");
  const debounced = useDebouncedValue(query, 600);
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const audio = useAudioPlayer(tracks);

  useEffect(() => {
    let active = true;
    if (!debounced) {
      setTracks([]);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);
    (async () => {
      try {
        const res = await searchTracks(debounced);
        if (!active) return;
        setTracks(res);
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to fetch");
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [debounced]);

  const handleToggle = (track) => {
    audio.toggle(track);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 pb-24 md:pb-8 pt-safe">
      <header className="max-w-5xl mx-auto p-4 md:p-8 pt-6 md:pt-8">
        <h1 className="text-xl md:text-2xl font-extrabold">
          Deezer Music Player
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Search songs, artists or albums and play 30s previews.
        </p>
      </header>

      <main className="max-w-5xl mx-auto px-4 md:px-8 space-y-4 md:space-y-6">
        <SearchBar
          value={query}
          onChange={setQuery}
          onSubmit={(q) => setQuery(q)}
        />

        {error && (
          <ErrorBanner
            message={error}
            onRetry={() => {
              setQuery(debounced);
            }}
          />
        )}

        {loading ? (
          <LoadingSpinner />
        ) : (
          <TrackList
            tracks={tracks}
            activeId={audio.currentTrack?.id}
            isPlaying={audio.isPlaying}
            onToggle={handleToggle}
          />
        )}
      </main>

      <PlayerBar
        currentTrack={audio.currentTrack}
        isPlaying={audio.isPlaying}
        progress={audio.progress}
        duration={audio.duration}
        onPlayPause={() => audio.toggle(audio.currentTrack)}
        onPrev={() => audio.prev()}
        onNext={() => audio.next()}
        onSeek={(t) => audio.seek(t)}
        volume={audio.volume}
        setVolume={(v) => audio.setVolume(v)}
      />
    </div>
  );
}

export default App;
