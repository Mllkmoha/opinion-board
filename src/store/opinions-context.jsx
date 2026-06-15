import { createContext, useEffect, useState } from "react";

function normalizeApiUrl(url) {
  try {
    const normalized = new URL(url.replace(/^https?:\/\//, "https://"));
    return normalized.origin;
  } catch (error) {
    return url;
  }
}

export const OpinionsContext = createContext({
  opinions: [],
  addOpinion: () => {},
  upvoteOpinion: () => {},
  downvoteOpinion: () => {},
});

export function OpinionsContextProvider({ children }) {
  const [opinions, setOpinions] = useState([]);
  const API_BASE_URL = normalizeApiUrl(
    import.meta.env.VITE_API_URL ?? "https://opinion-board-api.onrender.com",
  );

  useEffect(() => {
    async function loadOpinions() {
      try {
        const response = await fetch(`${API_BASE_URL}/opinions`);

        if (!response.ok) return;

        const data = await response.json();
        setOpinions(data);
      } catch (err) {
        console.error("Failed to load opinions:", err);
      }
    }

    loadOpinions();
  }, [API_BASE_URL]);

  async function addOpinion(enteredOpinionData) {
    const response = await fetch(`${API_BASE_URL}/opinions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(enteredOpinionData),
    });

    if (!response.ok) return;

    const savedOpinion = await response.json();

    setOpinions((prev) => [savedOpinion, ...prev]);
  }

  async function upvoteOpinion(id) {
    const response = await fetch(`${API_BASE_URL}/opinions/${id}/upvote`, {
      method: "POST",
    });

    if (!response.ok) return;

    const updatedOpinion = await response.json();

    setOpinions((prev) =>
      prev.map((op) => (op.id === id ? updatedOpinion : op)),
    );
  }

  async function downvoteOpinion(id) {
    const response = await fetch(`${API_BASE_URL}/opinions/${id}/downvote`, {
      method: "POST",
    });

    if (!response.ok) return;

    const updatedOpinion = await response.json();

    setOpinions((prev) =>
      prev.map((op) => (op.id === id ? updatedOpinion : op)),
    );
  }

  const ctxValue = {
    opinions,
    addOpinion,
    upvoteOpinion,
    downvoteOpinion,
  };

  return (
    <OpinionsContext.Provider value={ctxValue}>
      {children}
    </OpinionsContext.Provider>
  );
}
