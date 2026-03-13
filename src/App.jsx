import React, { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";
import './App.css'

function App() {
  const [note, setNote] = useState("");
  const [revealDate, setRevealDate] = useState("");
  const [mood, setMood] = useState("neutral");
  const [entries, setEntries] = useState([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [sortAsc, setSortAsc] = useState(true);
  const containerRef = useRef(null);


  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("timeCapsule")) || [];
    setEntries(saved);
  }, []);


  useEffect(() => {
    localStorage.setItem("timeCapsule", JSON.stringify(entries));
  }, [entries]);

  const handleSave = () => {
    if (!note || !revealDate) {
      Swal.fire({
        icon: "warning",
        title: "Oops...",
        text: "Please enter a note and a reveal date!"
      });
      return;
    }

    const newEntry = { note, revealDate, mood, id: Date.now() };
    setEntries([...entries, newEntry]);
    setNote("");
    setRevealDate("");
    setMood("neutral");

    Swal.fire({
      icon: "success",
      title: "Saved!",
      text: "Your note has been added successfully.",
      timer: 1500,
      showConfirmButton: false,
    });

    setTimeout(() => {
      containerRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        setEntries(entries.filter(e => e.id !== id));
        Swal.fire(
          'Deleted!',
          'Your note has been deleted.',
          'success'
        )
      }
    })
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    Swal.fire({
      icon: "success",
      title: "Copied!",
      text: "Note copied to clipboard.",
      timer: 1200,
      showConfirmButton: false,
    });
  };

  const today = new Date();

  const moodColors = {
    happy: "from-[#ffe3e3] to-[#ffb3b3]",
    calm: "from-[#e0f7fa] to-[#80deea]",
    focused: "from-[#e8eaf6] to-[#7986cb]",
    excited: "from-[#fff3e0] to-[#ffb74d]",
    neutral: "from-[#f3f4f6] to-[#d1d5db]",
  };

  const moodDescriptions = {
    happy: "Feeling joyful and positive",
    calm: "Relaxed and peaceful",
    focused: "Concentrated and attentive",
    excited: "Energetic and enthusiastic",
    neutral: "Balanced and steady",
  };

  const filteredEntries = entries
    .filter(e => filter === "all" ? true : e.mood === filter)
    .filter(e => e.note.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => sortAsc ? new Date(a.revealDate) - new Date(b.revealDate) : new Date(b.revealDate) - new Date(a.revealDate));

  return (
    <div className="min-h-screen p-4 md:p-12 font-sans bg-linear-to-br from-[#fdf6f0] via-[#f9f0f0] to-[#fdf0f5]">
      <h1 className="text-4xl md:text-5xl font-bold text-[#d97706] mb-8 text-center">
        Time Capsule Journal
      </h1>

    
      <div className="max-w-xl mx-auto bg-white p-6 md:p-8 rounded-3xl shadow-xl transform transition-all hover:scale-105 hover:shadow-2xl">
        <textarea
          className="w-full p-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#d97706] resize-none transition-all duration-300 hover:shadow-md"
          rows={4}
          placeholder="Write your note for the future..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
        <input
          type="date"
          className="w-full mt-4 p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#d97706] transition-all duration-300 hover:shadow-md"
          value={revealDate}
          onChange={(e) => setRevealDate(e.target.value)}
        />

        {/* Mood Selector */}
        <div className="mt-4 flex gap-2 flex-wrap">
          {["happy", "calm", "focused", "excited", "neutral"].map((m) => (
            <button
              key={m}
              onClick={() => setMood(m)}
              title={moodDescriptions[m]}
              className={`px-4 py-2 rounded-xl font-semibold text-white transition-all transform hover:scale-105 shadow-md ${
                mood === m ? "ring-2 ring-offset-2 ring-[#d97706]" : "opacity-70 hover:opacity-100"
              } ${
                m === "happy" ? "bg-pink-400" :
                m === "calm" ? "bg-teal-400" :
                m === "focused" ? "bg-indigo-400" :
                m === "excited" ? "bg-orange-400" :
                "bg-gray-400"
              }`}
            >
              {m}
            </button>
          ))}
        </div>

        <button
          onClick={handleSave}
          className="mt-6 w-full bg-[#d97706] text-white font-semibold py-3 rounded-2xl hover:bg-[#b45309] transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-2xl"
        >
          Save Note
        </button>

        <div className="mt-6 flex gap-2 flex-wrap justify-center">
          {["all", "happy", "calm", "focused", "excited", "neutral"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded-full border border-[#d97706] font-semibold transition-all hover:scale-105 ${
                filter === f ? "bg-[#d97706] text-white" : "bg-white text-[#d97706]"
              }`}
            >
              {f.toUpperCase()}
            </button>
          ))}
        </div>

        <input
          type="text"
          placeholder="Search notes..."
          className="w-full mt-4 p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#d97706] transition-all duration-300 hover:shadow-md"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          onClick={() => setSortAsc(!sortAsc)}
          className="mt-4 px-4 py-2 bg-[#d97706] text-white rounded-xl hover:bg-[#b45309] transition-all shadow-md"
        >
          Sort by Reveal Date {sortAsc ? "↑" : "↓"}
        </button>
      </div>

      <div
        className="mt-12 max-w-5xl mx-auto grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
        ref={containerRef}
      >
        {filteredEntries.map((entry) => {
          const reveal = new Date(entry.revealDate) <= today;
          return (
            <div
              key={entry.id}
              className={`relative p-5 rounded-3xl shadow-xl transform transition-all duration-500 hover:scale-105 hover:shadow-2xl border-l-8 border-[#d97706] bg-linear-to-br ${
                moodColors[entry.mood] || moodColors["neutral"]
              }`}
            >
              <div className="text-sm text-gray-600 mb-2">
                Reveal Date: {entry.revealDate}
              </div>

              <div
                className={`text-gray-800 font-medium text-lg transition-transform duration-500 ${
                  reveal ? "rotate-x-0 opacity-100" : "rotate-x-12 opacity-50 italic"
                }`}
              >
                {reveal ? entry.note : "🔒 This note is locked until the reveal date"}
              </div>

              <div className="absolute top-3 right-3 flex items-center gap-2">
                <span title={moodDescriptions[entry.mood]} className="text-sm text-gray-700 font-semibold">
                  {entry.mood.toUpperCase()}
                </span>
                {reveal && (
                  <button
                    onClick={() => handleCopy(entry.note)}
                    className="px-2 py-1 bg-white rounded shadow text-xs hover:bg-gray-100 transition"
                  >
                    Copy
                  </button>
                )}
                <button
                  onClick={() => handleDelete(entry.id)}
                  className="px-2 py-1 bg-red-500 rounded text-white text-xs hover:bg-red-600 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;