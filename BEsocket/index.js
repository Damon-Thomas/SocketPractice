import express from "express";
import cors from "cors";

const app = express();
const port = 8888;

// Enable CORS for all routes
app.use(
  cors({
    origin: "http://localhost:8080", // Allow requests from your React app
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.json({ message: "Hello World!" });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
