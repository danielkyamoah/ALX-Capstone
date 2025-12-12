# ALX-Capstone
A music player designed to bring eargasms.🙂‍↔️

🎵 Deezer Music Player — React + Tailwind

A simple, responsive music player built using React, TailwindCSS, and the Deezer API.
Users can search for songs, preview 30-second clips, view album details, and control playback.

🚀 Features
🔍 Search Music

Search by song title, artist, or album

Real-time search using debouncing

Displays:

Track title

Artist name

Album cover

Album name

▶️ Music Playback

Play/Pause

Next / Previous

Seek progress bar

Volume control

Uses Deezer's preview URL (30-second clips)

🖥 Responsive UI

Built with TailwindCSS

Works smoothly on mobile, tablet, and desktop

⚠️ Error Handling

Handles network errors

Displays messages for empty search results

Graceful fallback UI


src/
│── components/
│   ├── SearchBar.jsx
│   ├── TrackCard.jsx
│   ├── TrackList.jsx
│   ├── PlayerBar.jsx
│   ├── LoadingSpinner.jsx
│   └── ErrorBanner.jsx
│
│── hooks/
│   ├── useDebouncedValue.js
│   └── useAudioPlayer.js
│
│── utils/
│   └── api.js
│
├── App.jsx
├── main.jsx
└── index.css

🌐 API Endpoints Used
🔹 Search Tracks

https://api.deezer.com/search?q=<query>

🔹 Track Details

https://api.deezer.com/track/<id>

🔹 Album Details

https://api.deezer.com/album/<id>

🚀 Deployment

Deploy free on:

Vercel

Netlify

Just push to GitHub and connect your repo.

🧩 Stretch Features (Optional)

User Authentication

Playlist Creation

Lyrics Integration

Dark Mode

Voice Search

Visualizer / Equalizer

📜 License

MIT — free to use, modify, and build on.