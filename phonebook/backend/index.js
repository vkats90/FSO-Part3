require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const app = express();
const cors = require("cors");
const Phonenumber = require("./modules/phonenumber");

morgan.token("body", function (req, res) {
  return JSON.stringify(req.body);
});

app.use(express.json());
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);
app.use(cors());
app.use(express.static("build"));

let phonebook = [];

app.get("/api/persons", (req, res) => {
  Phonenumber.find({}).then((numbers) => {
    res.json(numbers);
  });
});

app.get("/api/persons/:id", (req, res) => {
  Phonenumber.findById(req.params.id)
    .then((note) => {
      res.json(note);
    })
    .catch((err) => res.status(404).end());
});

app.get("/info", (req, res) => {
  let date = new Date();
  Phonenumber.find({}).then((phonebook) => {
    res.send(
      `<p>Phonebook has info for ${phonebook.length} people</p>
      <p>${date}</p>`
    );
  });
});

app.delete("/api/persons/:id", (req, res) => {
  phonebook = phonebook.filter((x) => x.id != req.params.id);
  res.status(204).end();
});

app.post("/api/persons", (req, res) => {
  if (!req.body.name || !req.body.number)
    return res
      .status(400)
      .json({ error: "both a name and a phonebook must be submitted" });
  if (phonebook.find((n) => n.name === req.body.name))
    return res
      .status(400)
      .json({ error: "this name already exists in the phonebook" });
  let id = Math.floor(Math.random() * 5000);
  let note = { id, ...req.body };
  phonebook = phonebook.concat(note);
  res.json(note);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT);
console.log(`Server is running on port ${PORT}`);
