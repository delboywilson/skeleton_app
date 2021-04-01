require("dotenv").config();
const express = require("express");
const path = require("path");
const morgan = require("morgan");
const expressLayouts = require("express-ejs-layouts");
const app = express();
const PORT = process.env.PORT;

app.set("view engine", "ejs");

app.use("/static", express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(expressLayouts);

// routes
const indexRouter = require("./routes/index");

app.use("/", indexRouter);

app.listen(PORT, () => {
  console.log(`server is listening on localhost:${PORT}`);
});
