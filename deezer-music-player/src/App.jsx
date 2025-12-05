import { useEffect, useState } from "react";
import "./App.css";
import SearchBar from "./components/SearchBar";
import TrackList from "./components/TrackList";
import PlayerBar from "./components/PlayerBar";
import LoadingSpinner from "./components/LoadingSpinner";
import ErrorBanner from "./components/ErrorBanner";
import useDebouncedValue from "./hooks/useDebouncedValue";
import useAudioPlayer from "./hooks/useAudioPlayer";
import { searchTracks } from "./utils/api";

function App() {
  const [query, setQuery] = useState("");
  const debounced = useDebouncedValue(query, 600);
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const audio = useAudioPlayer(tracks)

  useEffect(() => {
    let active = true
  if (!debounced) {
    setTracks ([])
    setError(null)
    return
  }

  setLoading(true)
    setError(null)
    ;(async () => {
      try {
        const res = await searchTracks(debounced)
        if (!active) return
        setTracks(res)
      } catch (err) {
        console.error(err)
        setError(err.message || 'Failed to fetch')
      } finally {
        if (active) setLoading(false)
      }
    })()
    return () => { active = false }
  }, [debounced])

  const handleToggle = (track) => {
    audio.toggle(track)
  }




  }

export default App;
