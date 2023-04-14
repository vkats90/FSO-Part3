// this phonebook app uses both then/catch and async/await becuse its a learning experience

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
    .then((num) => {
      res.json(num);
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

app.delete("/api/persons/:id", async (req, res, next) => {
  try {
    const num = await Phonenumber.findByIdAndRemove(req.params.id);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

app.post("/api/persons", (req, res) => {
  if (!req.body.name || !req.body.number)
    return res
      .status(400)
      .json({ error: "both a name and a phonebook must be submitted" });

  let person = new Phonenumber({ ...req.body });

  person
    .save()
    .then((num) => {
      res.json(num);
    })
    .catch((err) => res.status(404).end);
});

const errorHandler = (err, req, res, next) => {
  console.log(err.message);

  if (err.name == "CastError")
    res.status(400).json({ error: "malformatted id" });

  next(err);
};

const unknowEndpoint = (req, res) => {
  res.status(404).json({ error: "Unknown endpoint" });
};

app.use(unknowEndpoint);
app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT);
console.log(`Server is running on port ${PORT}`);
