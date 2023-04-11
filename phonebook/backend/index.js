const express = require("express");
const morgan = require("morgan");
const app = express();
const cors = require("cors");

morgan.token("body", function (req, res) {
  return JSON.stringify(req.body);
});

app.use(express.json());
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);
app.use(cors());

let phonebook = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/api/persons", (req, res) => {
  res.json(phonebook);
});

app.get("/api/persons/:id", (req, res) => {
  const note = phonebook.find((n) => n.id == req.params.id);
  note ? res.json(note) : res.status(404).end();
});

app.get("/info", (req, res) => {
  let date = new Date();
  res.send(
    `<p>Phonebook has info for ${phonebook.length} people</p>
    <p>${date}</p>`
  );
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

const PORT = 3001;
app.listen(PORT);
console.log(`Server is running on port ${PORT}`);
