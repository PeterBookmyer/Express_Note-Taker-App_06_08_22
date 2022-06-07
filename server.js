const express = require("express");
const path = require("path");
const notes = require("./db/db.json");
const fs = require("fs");

const PORT = 3001;
const app = express();

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

//read - creates homepage
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/index.html"))
});

//read notes
app.get('/api/notes', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/notes.html'));
  res.status(200).json(notes);
});


 app.listen(PORT, () =>
  console.log(`Express server listening on port ${PORT}!`)
);
