const mongoose = require("mongoose");

url = process.env.MONGODB_URL;

mongoose.set("strictQuery", false);

console.log("Connecting to database");

mongoose
  .connect(url)
  .then((res) => console.log("connected to database"))
  .catch("failed to connect to database");

const numberSchema = new mongoose.Schema({
  name: String,
  number: String,
});

numberSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Phonenumber", numberSchema);
