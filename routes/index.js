const express = require("express");
const router = express.Router();
const db = require("rethinkdb");

let connection;
db.connect({ host: "localhost", port: 28015, db: "test" }).then(conn => {
  connection = conn;
});

router.get("/", async (req, res) => {
  const posts = await db
    .table("posts")
    .orderBy(db.desc("date"))
    .run(connection)
    .then(cursor => cursor.toArray());

  res.render("index", { posts });
});

router.get("/new", (req, res) => {
  res.render("new");
});

router.post("/new", async (req, res) => {
  const post = {
    title: req.body.title,
    content: req.body.content,
    date: new Date()
  };

  db.table("posts")
    .insert(post)
    .run(connection)
    .then(() => res.redirect("/"));
});

module.exports = router;
