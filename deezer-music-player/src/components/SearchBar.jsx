import { useState } from "react";
import { FiSearch } from "react-icons/fi";

export default function SearchBar({ value, onChange, onSubmit }) {
  const [q, setQ] = useState(value || "");
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(q);
      }}
      className="w-full"
    >
      <div className="flex items-center gap-2">
        <input
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            onChange && onChange(e.target.value);
          }}
          placeholder="Search songs, artists, albums..."
          className="flex-1 p-3 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-base"
        />
        <button
          className="px-3 md:px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 transition-colors"
          type="submit"
        >
          <FiSearch className="w-5 h-5" />
          <span className="hidden sm:inline">Search</span>
        </button>
      </div>
    </form>
  );
}
