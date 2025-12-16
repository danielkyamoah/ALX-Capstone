# Music Application

This is a music application built with React that allows users to explore global music charts, search for songs, view track details, and keep a history of recently played tracks and searches.

## Features

*   **Global Charts:** Browse a list of trending songs from around the world.
*   **Music Search:** Search for your favorite songs and artists.
*   **Track Details:** View detailed information for each song, including album art and a playable preview.
*   **Recently Played:** Keeps a record of the songs you've listened to.
*   **Search History:** Stores your recent search queries for quick access.
*   **Responsive Design:** Optimized for both mobile and desktop screens.

## Technologies Used

*   **React:** A JavaScript library for building user interfaces.
*   **React Router DOM:** For declarative routing in React applications.
*   **Vite:** A fast build tool that provides a lightning-fast development experience.
*   **Tailwind CSS:** A utility-first CSS framework for rapid UI development.

## Setup Instructions

To get this project up and running on your local machine, follow these steps:

### Prerequisites

Make sure you have Node.js and npm (Node Package Manager) installed.

*   [Node.js](https://nodejs.org/en/download/) (which includes npm)

### Installation

1.  **Clone the repository:**

    ```bash
    git clone <repository-url>
    cd music-app
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

## Running the Application

To start the development server and view the application in your browser:

```bash
npm run dev
```

The application should open automatically in your default web browser, usually at `http://localhost:5173/`.

## API Integration

This application interacts with a backend server that acts as a proxy to an external music API (like Deezer). The frontend makes calls to local endpoints such as:

*   `/api/search`: For searching tracks.
*   `/api/track/:id`: To get details for a specific track.
*   `/api/chart`: To fetch global music charts.

To add more music APIs, you would typically need to:

1.  **Choose an API:** Select a new music service (e.g., Spotify, Apple Music).
2.  **Update Backend:** Modify your backend server to handle requests to the new API and process its responses.
3.  **Update Frontend:** Create new utility functions and integrate them into the React components to display data from the new API.
