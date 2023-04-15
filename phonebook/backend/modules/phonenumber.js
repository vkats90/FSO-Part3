const mongoose = require("mongoose");

url = process.env.MONGODB_URL;

mongoose.set("strictQuery", false);

console.log("Connecting to database");

mongoose
  .connect(url)
  .then((res) => console.log("connected to database"))
  .catch("failed to connect to database");

const numberSchema = new mongoose.Schema({
  name: { type: String, minLength: 3, required: true },
  number: {
    type: String,
    minLength: 8,
    validate: {
      validator: (v) => {
        return /^\d{2,3}-\d+$/.test(v);
      },
      message: (props) => `${props.value} is not a valid phone number!`,
    },
    required: true,
  },
});

numberSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Phonenumber", numberSchema);
