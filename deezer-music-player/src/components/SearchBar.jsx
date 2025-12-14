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
          className="flex-1 p-3 rounded-md border outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
        />
        <button
          className="px-4 py-2 bg-indigo-600 text-white rounded-md flex items-center gap-2"
          type="submit"
        >
          <FiSearch />
          Search
        </button>
      </div>
    </form>
  );
}
