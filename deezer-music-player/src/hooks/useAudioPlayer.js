import { useEffect, useRef, useState } from 'react'
if (!track || !track.preview) return
const audio = audioRef.current
if (!currentTrack || currentTrack.id !== track.id) {
  audio.src = track.preview
  setCurrentTrack(track)
  setProgress(0)
}
audio.play()
setIsPlaying(true)



const pause = () => {
  audioRef.current.pause()
  setIsPlaying(false)
}


const toggle = (track) => {
  if (!track) return
  if (!currentTrack || currentTrack.id !== track.id) return play(track)
  return isPlaying ? pause() : play(currentTrack)
}


const seek = (timeSec) => {
  audioRef.current.currentTime = timeSec
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
  setTrackList: () => { }
}
