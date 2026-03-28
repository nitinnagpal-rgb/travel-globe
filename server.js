const express = require("express");
const path = require("path");
const app = express();
app.use(express.static("."));
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});
app.listen(5000, "0.0.0.0", () => console.log("listening on 5000"));
