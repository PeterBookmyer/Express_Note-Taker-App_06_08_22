const express = require("express");
const path = require("path");
const notes = require("./db/db.json");
const fs = require("fs");
const uuid = require("./helpers/uuid");
const req = require("express/lib/request");
const res = require("express/lib/response");
const PORT = process.env.PORT || 3001;

const app = express();

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

//GET route - homepage
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});

//GET route - notes
app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/notes.html"));
});

app.get("/notes", (req, res) => {
  res.status(200).json(notes);
});

//reads new note from user
app.get("/api/notes", (req, res) => {
  fs.readFile("./db/db.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json(err);
    } else {
      res.status(200).json(JSON.parse(data));
    }
  });
});

//POST new note from user
app.post("/api/notes", async (req, res) => {
  console.info(`${req.method} request received to get notes`);

  const { title, text } = req.body;

  if (title && text) {
    await readAndAppend({ ...req.body, id: uuid() }, "db/db.json");
    res.status(200).send("Post /api/notes route SUCCESS!");
  } else {
    res.status(400).send("bad request");
  }
});

//DELETE notes from user
app.delete("/api/notes/:id", (req, res) => {
  const id = req.params.id;
  console.log("delete note", id);
  fs.readFile("./db/db.json", "utf-8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json(err);
    } else {
      let notes = JSON.parse(data);
      let newNotes = notes.filter((note) => note.id != id);
      writeToFile("./db/db.json", newNotes);
      res.status(200).json(newNotes);
    }
  });
});

//defines my writeToFile function
const writeToFile = (destination, content) =>
  fs.writeFile(destination, JSON.stringify(content, null, 4), (err) =>
    err ? console.error(err) : console.info(`\nData written to ${destination}`)
  );

//defines my readAndAppend function
const readAndAppend = (content, file) => {
  fs.readFile(file, "utf8", (err, data) => {
    if (err) {
      console.error(err);
    } else {
      const parsedData = JSON.parse(data);
      parsedData.push(content);
      writeToFile(file, parsedData);
    }
  });
};

//app listener
app.listen(PORT, () =>
  console.log(`Express server listening on port ${PORT}!`)
);
