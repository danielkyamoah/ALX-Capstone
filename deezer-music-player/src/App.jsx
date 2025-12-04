import { useState } from 'react'
import './App.css'
import SearchBar from './components/SearchBar'
import TrackList from './components/TrackList'
import PlayerBar from './components/PlayerBar'
import LoadingSpinner from './components/LoadingSpinner'
import ErrorBanner from './components/ErrorBanner'
import useDebouncedValue from './hooks/useDebouncedValue'
import useAudioPlayer from './hooks/useAudioPlayer'
import { searchTracks } from './utils/api'

function App() {
  const [query, setQuery] = useState('')
  const debounced = useDebouncedValue(query, 600)
  const [tracks, setTracks] = useState([])
  

 
  
}

export default App
