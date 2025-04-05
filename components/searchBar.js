import { useState, useEffect } from "react";

function SearchBar({ onClick }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Debounce: Warte 300ms, bevor die Suche ausgeführt wird
    const delayDebounce = setTimeout(() => {
      if (query.trim() !== "") {
        setIsLoading(true);
        fetch(`/api/product/search?q=${encodeURIComponent(query)}`)
          .then((res) => res.json())
          .then((data) => {
            setResults(data);
            setIsLoading(false);
          })
          .catch(() => {
            setResults([]);
            setIsLoading(false);
          });
      } else {
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  return (
    <div className="relative w-full max-w-md">
      <input
        type="text"
        placeholder="Suche nach Name oder ID..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full border border-gray-300 rounded p-2"
      />
      {isLoading && (
        <p className="absolute right-2 top-2 text-sm text-gray-500">Lädt...</p>
      )}
      {results.length > 0 && (
        <ul className="z-[10] absolute w-full bg-white border border-gray-300 rounded mt-1 max-h-64 overflow-y-auto">
          {results.map((result) => (
            <li
              key={result.id}
              className="p-2 hover:bg-gray-100 cursor-pointer text-neutral-500"
              onClick={() => onClick(result.id)}
            >
              {result.title}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SearchBar;
