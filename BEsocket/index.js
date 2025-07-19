import express from "express";
import cors from "cors";
import { createServer } from "node:http";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { Server } from "socket.io";
import sqlite3 from "sqlite3";
import { open } from "sqlite";

// open the database file
const db = await open({
  filename: "data/chat.db",
  driver: sqlite3.Database,
});

// create our 'messages' table (you can ignore the 'client_offset' column for now)
await db.exec(`
  CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      client_offset TEXT UNIQUE,
      content TEXT
  );
`);
const app = express();
const port = 8888;
const server = createServer(app);

const io = new Server(server, {
  connectionStateRecovery: {},
});

// Enable CORS for all routes
app.use(
  cors({
    origin: "http://localhost:8080", // Allow requests from your React app
    credentials: true,
  })
);

const __dirname = dirname(fileURLToPath(import.meta.url));

app.get("/", (req, res) => {
  res.sendFile(join(__dirname, "index.html"));
});

io.on("connection", async (socket) => {
  socket.on("chat message", async (msg) => {
    let result;
    try {
      result = await db.run("INSERT INTO messages (content) VALUES (?)", msg);
    } catch (e) {
      // TODO handle the failure
      return;
    }
    io.emit("chat message", msg, result.lastID);
  });

  if (!socket.recovered) {
    // if the connection state recovery was not successful
    try {
      await db.each(
        "SELECT id, content FROM messages WHERE id > ?",
        [socket.handshake.auth.serverOffset || 0],
        (_err, row) => {
          socket.emit("chat message", row.content, row.id);
        }
      );
    } catch (e) {
      // something went wrong
    }
  }
});

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
