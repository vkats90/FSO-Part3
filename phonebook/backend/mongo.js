const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("give password as argument");
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://mars77:${password}@cluster0.xbzwd5f.mongodb.net/phonebook?retryWrites=true&w=majority`;

mongoose.set("strictQuery", false);
mongoose.connect(url);

const phoneBookSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Phonenumber = mongoose.model("Phonenumber", phoneBookSchema);

const phonenumber = new Phonenumber({
  name: process.argv[3],
  number: process.argv[4],
});

if (phonenumber.name) {
  phonenumber.save().then((result) => {
    console.log(
      `added ${phonenumber.name} number ${phonenumber.number} to the phonebook `
    );
    mongoose.connection.close();
  });
} else {
  Phonenumber.find({}).then((res) => {
    console.log("phonebook:");
    res.map((number) => console.log(`${number.name} ${number.number}`));
    mongoose.connection.close();
  });
}
