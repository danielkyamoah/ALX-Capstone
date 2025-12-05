import { useEffect, useRef, useState } from 'react'

export default function useAudioPlayer(initialTrackList = []) {
  const audioRef = useRef(null)
  const [trackList, setTrackList] = useState(initialTrackList)
  const [currentTrack, setCurrentTrack] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)

  // Create audio element once
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio()
    }
    const audio = audioRef.current

    const onTimeUpdate = () => setProgress(audio.currentTime || 0)
    const onLoadedMeta = () => setDuration(audio.duration || 0)
    const onEnded = () => {
      setIsPlaying(false)
      // auto-advance
      if (trackList && trackList.length > 0 && currentTrack) {
        const idx = trackList.findIndex(t => t.id === currentTrack.id)
        const nextIdx = (idx + 1) % trackList.length
        if (nextIdx !== idx) play(trackList[nextIdx])
      }
    }

    audio.addEventListener('timeupdate', onTimeUpdate)
    audio.addEventListener('loadedmetadata', onLoadedMeta)
    audio.addEventListener('ended', onEnded)

    return () => {
      audio.pause()
      audio.removeEventListener('timeupdate', onTimeUpdate)
      audio.removeEventListener('loadedmetadata', onLoadedMeta)
      audio.removeEventListener('ended', onEnded)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trackList, currentTrack])

  useEffect(() => {
    setTrackList(initialTrackList || [])
  }, [initialTrackList])

  const play = async (track) => {
    if (!track || !track.preview) return
    const audio = audioRef.current || (audioRef.current = new Audio())
    try {
      if (!currentTrack || currentTrack.id !== track.id) {
        audio.src = track.preview
        setCurrentTrack(track)
        setProgress(0)
      }
      audio.volume = volume
      await audio.play()
      setIsPlaying(true)
    } catch (err) {
      console.error('Audio play failed:', err)
      setIsPlaying(false)
    }
  }

  const pause = () => {
    const a = audioRef.current
    if (!a) return
    a.pause()
    setIsPlaying(false)
  }

  const toggle = (track) => {
    if (!track && !currentTrack) return
    if (track && (!currentTrack || currentTrack.id !== track.id)) return play(track)
    return isPlaying ? pause() : play(currentTrack)
  }

  const seek = (timeSec) => {
    const a = audioRef.current
    if (!a) return
    a.currentTime = timeSec
    setProgress(timeSec)
  }

  const next = () => {
    if (!trackList || trackList.length === 0 || !currentTrack) return
    const idx = trackList.findIndex(t => t.id === currentTrack.id)
    const nextIdx = (idx + 1) % trackList.length
    play(trackList[nextIdx])
  }

  const prev = () => {
    if (!trackList || trackList.length === 0 || !currentTrack) return
    const idx = trackList.findIndex(t => t.id === currentTrack.id)
    const prevIdx = (idx - 1 + trackList.length) % trackList.length
    play(trackList[prevIdx])
  }

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume
  }, [volume])

  return {
    audioRef,
    currentTrack,
    isPlaying,
    progress,
    duration,
    volume,
    setVolume,
    play,
    pause,
    toggle,
    seek,
    next,
    prev,
    setTrackList
  }
}
