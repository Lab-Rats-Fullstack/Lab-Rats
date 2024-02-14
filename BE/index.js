require("dotenv").config();

const { PORT = 3000 } = process.env;
const express = require("express");
const cors = require("cors");
const server = express();

server.use(cors());

const apiRouter = require("./api");
server.use("/api", apiRouter);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
