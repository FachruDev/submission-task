"use client";

import { useState } from "react";

export default function HomePage() {
  const [ query, setQuery ] = useState('');
  const [ results, setResults ] = useState([]);
  const [ isLoading, setIsLoading ] = useState(false);
  const [ error, setError ] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    setResults([]);

    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: query }),
      });

      if (!response.ok) {
        throw new Error('Something went wrong with this request.');
      }

      const data = await response.json();
      setResults(data);

    } catch (err) {
      setError(err.message || 'Failed to fetch results. please try again.');
    } finally {
      setIsLoading(false)
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-start py-12 px-4">
      <h1 className="text-3xl font-bold mb-8 text-blue-700">Neptune Service Search</h1>
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-xl flex gap-2 mb-8"
      >
        <input
          type="text"
          className="flex-1 px-4 text-black py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Search for a service..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          required
        />
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          disabled={isLoading}
        >
          {isLoading ? "Searching..." : "Search"}
        </button>
      </form>

      {error && (
        <div className="mb-6 w-full max-w-xl bg-red-100 text-red-700 px-4 py-2 rounded">
          {error}
        </div>
      )}

      <section className="w-full max-w-3xl grid grid-cols-1 md:grid-cols-2 gap-6">
        {results.length > 0 && results.map((item, idx) => (
          <div
            key={idx}
            className="bg-white shadow-md rounded-lg p-6 flex flex-col gap-2 border border-gray-100"
          >
            <h2 className="text-xl font-semibold text-blue-800">{item.name}</h2>
            <div className="flex items-center gap-2">
              <span className="text-yellow-500 font-bold">{item.rating}★</span>
              <span className="text-gray-500 text-sm">Neptune Score: <span className="font-bold">{item.neptuneScore}</span></span>
            </div>
            <div className="text-gray-700">Price: <span className="font-semibold">{item.price}</span></div>
            <div className="text-gray-600 text-sm">Booking: {item.bookingInfo}</div>
          </div>
        ))}
        {isLoading && (
          <div className="col-span-full text-center text-blue-600">Loading results...</div>
        )}
        {!isLoading && results.length === 0 && !error && (
          <div className="col-span-full text-center text-gray-400">No results yet. Try searching for a service!</div>
        )}
      </section>
    </main>
  )
}