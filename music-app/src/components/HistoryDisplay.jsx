import React from "react";
import { useNavigate } from "react-router-dom";

const HistoryDisplay = ({ title, items, type, onClear, onSelect }) => {
  const navigate = useNavigate();

  const handleItemClick = (item) => {
    if (type === "tracks") {
      navigate(`/track/${item.id}`);
    } else if (type === "searches") {
      onSelect(item);
      navigate("/search", { state: { initialSearchQuery: item } });
    }
  };

  return (
    <section className="w-full max-w-4xl mb-12">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-[#6773D2]">{title}</h2>
        {items.length > 0 && (
          <button
            onClick={onClear}
            className="text-sm text-red-400 hover:text-red-600 transition-colors duration-200"
          >
            Clear All
          </button>
        )}
      </div>
      {items.length > 0 ? (
        <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {items.map((item, index) => (
            <div
              key={type === "tracks" ? item.id : `search-${item}-${index}`}
              className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer hover:bg-[#FF9FB2] transition-colors duration-200"
              onClick={() => handleItemClick(item)}
            >
              {type === "tracks" && (
                <img
                  src={item.album?.cover_medium}
                  alt={item.title}
                  className="w-full h-auto object-cover"
                />
              )}
              <div className="p-3 text-sm">
                <h3 className="font-semibold truncate">
                  {type === "tracks" ? item.title : item}
                </h3>
                {type === "tracks" && (
                  <p className="text-[#0A3200] truncate">{item.artist?.name}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 col-span-full">
          No {title.toLowerCase()} yet.
        </p>
      )}
    </section>
  );
};

export default HistoryDisplay;
