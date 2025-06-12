// It's necessary because we are using React hooks like useState for interactivity.
"use client";

import { useState } from "react";

export default function HomePage() {
  // --- STATE MANAGEMENT ---
  // We use React's useState hook to manage the component's state.

  // 'query' holds the text currently typed into the search input.
  const [query, setQuery] = useState('');
  // 'results' stores the array of data returned from our backend API.
  const [results, setResults] = useState([]);
  // 'isLoading' is a boolean flag to track when the API call is in progress.
  // This is used to show loading indicators and disable the search button.
  const [isLoading, setIsLoading] = useState(false);
  // 'error' stores any error messages if the API call fails.
  const [error, setError] = useState(null);

  /**
   * Handles the form submission event.
   * This async function sends the user's query to our backend API endpoint.
   * @param {React.FormEvent} event - The form submission event.
   */
  const handleSubmit = async (event) => {
    // Prevent the default form behavior which causes a full page reload.
    event.preventDefault();

    // Reset component state for a new search.
    setIsLoading(true);
    setError(null);
    setResults([]);

    try {
      // Send a POST request to our own API route using the browser's fetch API.
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // The body of the request contains the user's query.
        body: JSON.stringify({ query: query }),
      });

      // If the response is not successful (e.g., a 500 error from the server), throw an error.
      if (!response.ok) {
        throw new Error('Something went wrong with this request.');
      }

      // Parse the JSON data from the successful response.
      const data = await response.json();
      // Update the 'results' state with the data, triggering a re-render to display it.
      setResults(data);

    } catch (err) {
      // If any part of the try block fails, catch the error.
      setError(err.message || 'Failed to fetch results. Please try again.');
    } finally {
      // The 'finally' block always runs, whether the request succeeded or failed.
      // This ensures the loading state is always turned off after the process completes.
      setIsLoading(false);
    }
  };

  // --- JSX RENDER ---
  // The structure of the page is defined below using JSX.
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-start py-12 px-4">
      <h1 className="text-3xl font-bold mb-8 text-blue-700">Neptune Service Search</h1>
      
      {/* Search form */}
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
          {/* The button text changes based on the loading state. */}
          {isLoading ? "Searching..." : "Search"}
        </button>
      </form>

      {/* Conditional rendering for the error message. */}
      {error && (
        <div className="mb-6 w-full max-w-xl bg-red-100 text-red-700 px-4 py-2 rounded">
          {error}
        </div>
      )}

      {/* Section to display search results, loading state, or initial message. */}
      <section className="w-full max-w-3xl grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Map over the results array and render a card for each item. */}
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
        
        {/* Display a loading message when isLoading is true. */}
        {isLoading && (
          <div className="col-span-full text-center text-blue-600">Loading results...</div>
        )}
        
        {/* Display an initial message when the page first loads. */}
        {!isLoading && results.length === 0 && !error && (
          <div className="col-span-full text-center text-gray-400">No results yet. Try searching for a service!</div>
        )}
      </section>
    </main>
  );
}
