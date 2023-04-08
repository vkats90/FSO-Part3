const express = require("express");
const app = express();

app.use(express.json());

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

const PORT = 3001;
app.listen(PORT);
console.log(`Server is running on port ${PORT}`);
