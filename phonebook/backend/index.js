// this phonebook app uses both then/catch and async/await becuse its a learning experience

require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const app = express();
const cors = require("cors");
const Phonenumber = require("./modules/phonenumber");

morgan.token("body", function (req, _res) {
  return JSON.stringify(req.body);
});

app.use(express.json());
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);
app.use(cors());
app.use(express.static("build"));

app.get("/api/persons", (_req, res) => {
  Phonenumber.find({}).then((numbers) => {
    res.json(numbers);
  });
});

app.get("/api/persons/:id", (req, res) => {
  Phonenumber.findById(req.params.id)
    .then((num) => {
      res.json(num);
    })
    .catch((_err) => res.status(404).end());
});

app.get("/info", (_req, res) => {
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
    console.log(num);
    num
      ? res.status(204).end()
      : res.status(400).json({ error: "Number was already deleted" });
  } catch (err) {
    next(err);
  }
});

app.post("/api/persons", (req, res, next) => {
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
    .catch((err) => next(err));
});

app.put("/api/persons/:id", async (req, res, next) => {
  try {
    const person = await Phonenumber.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
      },
      { new: true, runValidators: true, context: "query" }
    );
    res.json(person);
  } catch (err) {
    next(err);
  }
});

const errorHandler = (err, _req, res, next) => {
  console.log(err.message);

  if (err.name == "CastError")
    return res.status(400).json({ error: "malformatted id" });
  else if (err.name == "ValidationError") {
    return res.status(400).json({ err: err.message });
  }
  next(err);
};

const unknowEndpoint = (_req, res) => {
  res.status(404).json({ error: "Unknown endpoint" });
};

app.use(unknowEndpoint);
app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT);
console.log(`Server is running on port ${PORT}`);
