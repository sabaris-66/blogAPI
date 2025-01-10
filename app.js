require("dotenv").config();
const express = require("express");
const port = process.env.PORT || 3000;
const apiRouter = require("./routes/apiRouter");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/api", apiRouter);

app.listen(port, () => console.log(`Started listening on port, ${port}`));
