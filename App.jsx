import React, { useState, useEffect } from "react";

export default function App() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(null);
  const [filterYear, setFilterYear] = useState("");
  const [searchBy, setSearchBy] = useState("title");

  async function searchBooks(newPage = 1) {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const qParam = encodeURIComponent(query.trim());
      let url = `https://openlibrary.org/search.json?${searchBy}=${qParam}&page=${newPage}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Network response was not ok");
      const data = await res.json();
      let docs = data.docs || [];
      if (filterYear) docs = docs.filter(d => d.first_publish_year == filterYear);
      setResults(docs);
      setPage(newPage);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch results. Try again.");
    } finally {
      setLoading(false);
    }
  }

  function coverUrl(doc) {
    if (doc.cover_i) return `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg`;
    if (doc.isbn && doc.isbn.length) return `https://covers.openlibrary.org/b/isbn/${doc.isbn[0]}-M.jpg`;
    return null;
  }

  function openDetails(doc) {
    setSelected(doc);
  }

  function closeDetails() {
    setSelected(null);
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-4xl mx-auto">
        <header className="mb-6">
          <h1 className="text-3xl font-bold">Book Finder</h1>
          <p className="text-slate-600 mt-1">
            Search books via Open Library — fast, simple, and student-friendly.
          </p>
        </header>
      </div>
    </div>
  );
}