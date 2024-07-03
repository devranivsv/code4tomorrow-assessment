require("dotenv").config();

const express = require("express");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.use("/", require("./routes"));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
