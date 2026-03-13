const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = "0.0.0.0";
const DIST_DIR = path.join(__dirname, "dist");
const DIST_INDEX = path.join(DIST_DIR, "index.html");

app.use(express.json());
app.use(express.static(DIST_DIR));

app.get("/health", (req, res) => {
  res.status(200).send("ok");
});

app.get("*", (req, res) => {
  if (!fs.existsSync(DIST_INDEX)) {
    res.status(500).send("Missing dist build. Run: npm run build");
    return;
  }
  res.sendFile(DIST_INDEX);
});

app.listen(PORT, HOST, () => {
  console.log(`Server running on http://${HOST}:${PORT}`);
});
