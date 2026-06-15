import fs from "node:fs/promises";

import express from "express";

const app = express();

// CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  next();
});

async function loadOpinions() {
  try {
    const dbFileData = await fs.readFile("./db.json");
    const parsedData = JSON.parse(dbFileData);
    return parsedData.opinions;
  } catch (error) {
    return [];
  }
}

async function saveOpinion(opinion) {
  const opinions = await loadOpinions();
  const newOpinion = { id: new Date().getTime(), votes: 0, ...opinion };
  opinions.unshift(newOpinion);
  const dataToSave = { opinions };
  await fs.writeFile("./db.json", JSON.stringify(dataToSave, null, 2));
  return newOpinion;
}

async function upvoteOpinion(id) {
  const opinions = await loadOpinions();
  const opinion = opinions.find((o) => o.id === id);
  if (!opinion) {
    return null;
  }
  opinion.votes++;
  await fs.writeFile("./db.json", JSON.stringify({ opinions }, null, 2));
  return opinion;
}

async function downvoteOpinion(id) {
  const opinions = await loadOpinions();
  const opinion = opinions.find((o) => o.id === id);
  if (!opinion) {
    return null;
  }
  opinion.votes--;
  await fs.writeFile("./db.json", JSON.stringify({ opinions }, null, 2));
  return opinion;
}

app.use(express.json());

app.get("/opinions", async (req, res) => {
  try {
    const opinions = await loadOpinions();
    res.json(opinions);
  } catch (error) {
    res.status(500).json({ error: "Error loading opinions." });
  }
});

app.post("/opinions", async (req, res) => {
  const { userName, title, body } = req.body;

  await new Promise((resolve) => setTimeout(resolve, 1000));

  if (!userName || !title || !body) {
    return res
      .status(400)
      .json({ error: "User name, title and opinion body are required." });
  }
  try {
    const newOpinion = await saveOpinion({ userName, title, body });
    res.status(201).json(newOpinion);
  } catch (error) {
    res.status(500).json({ error: "Error saving opinion." });
  }
});

app.post("/opinions/:id/upvote", async (req, res) => {
  const { id } = req.params;
  await new Promise((resolve) => setTimeout(resolve, 1000));
  try {
    const opinion = await upvoteOpinion(Number(id));
    if (!opinion) {
      return res.status(404).json({ error: "Opinion not found." });
    }
    res.json(opinion);
  } catch (error) {
    res.status(500).json({ error: "Error upvoting opinion." });
  }
});

app.post("/opinions/:id/downvote", async (req, res) => {
  const { id } = req.params;
  await new Promise((resolve) => setTimeout(resolve, 1000));
  try {
    const opinion = await downvoteOpinion(Number(id));
    if (!opinion) {
      return res.status(404).json({ error: "Opinion not found." });
    }
    res.json(opinion);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error downvoting opinion." });
  }
});

app.delete("/opinions/:id", async (req, res) => {
  const { id } = req.params;
  await new Promise((resolve) => setTimeout(resolve, 1000));
  try {
    const opinions = await loadOpinions();
    const opinionIndex = opinions.findIndex((o) => o.id === Number(id));
    if (opinionIndex === -1) {
      return res.status(404).json({ error: "Opinion not found." });
    }
    opinions.splice(opinionIndex, 1);
    await fs.writeFile("./db.json", JSON.stringify({ opinions }, null, 2));
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: "Error deleting opinion." });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
