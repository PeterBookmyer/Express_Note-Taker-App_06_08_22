const express = require("express");
const path = require("path");
const notes = require("./db/db.json");
const fs = require("fs");
const uuid = require("./helpers/uuid");

const PORT = 3001;
const app = express();

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

//HTML route homepage
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});

//HTML route notes
app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/notes.html"));
});

app.get("/notes", (req, res) => {
  res.status(200).json(notes);
});

const writeToFile = (destination, content) =>
  fs.writeFile(destination, JSON.stringify(content, null, 4), (err) =>
    err ? console.error(err) : console.info(`\nData written to ${destination}`)
  );

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

app.get("/api/notes", (req, res) => {
  res.json(`${req.method} request received to get notes`);
  console.info(`${req.method} request received to get notes`);
});

// adds notes
app.post("/api/notes", (req, res) => {
  console.info(`${req.method} request received to add a note`);

  const { noteTitle, noteText } = req.body;

  if (req.body) {
    const newNote = {
      noteTitle,
      noteText,
      id: uuid(),
    };

    readAndAppend(newNote, "./db/db.json");
    res.json(`note added successfully 🚀`);
  } else {
    res.error("Error in adding note");
  }
});

//app listener
app.listen(PORT, () =>
  console.log(`Express server listening on port ${PORT}!`)
);
