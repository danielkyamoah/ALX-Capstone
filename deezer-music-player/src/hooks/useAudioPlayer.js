// hooks/useAudioPlayer.js
import { useRef, useState, useEffect } from 'react';
export default function useAudioPlayer() {
  const audioRef = useRef(new Audio());
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [progress, setProgress] = useState(0);
  const play = (track) => {
    if (!track || !track.preview) return;
    const audio = audioRef.current;
    if (currentTrack?.id !== track.id) {
      audio.src = track.preview;
      setCurrentTrack(track);
    }
    audio.play();
  };
  // ...add pause, seek, volume logic, event listeners for timeupdate/ended/error
  return { play, pause, isPlaying, currentTrack, progress, setVolume: v=> audioRef.current.volume = v };
}
