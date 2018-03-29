require("dotenv").config();
const express = require("express"),
  app = express(),
  { json } = require("body-parser"),
  cors = require("cors"),
  massive = require("massive"),
  port = process.env.PORT || 3001;

massive(process.env.CONNECTION_STRING)
  .then(dbInstance => {
    console.log("dbInstance: ", dbInstance);
    app.set("db", dbInstance);
  })
  .catch(console.log);

app.get("/api/people", (req, res) => {
  const db = req.app.get("db");
  if (req.query.email) {
    db
      .get_people_by_email([req.query.email])
      .then(person => res.status(200).json(person))
      .catch(console.log);
  } else {
    db
      .get_people()
      .then(people => res.status(200).json(people))
      .catch(console.log);
  }
});

app.delete("/api/people/:id", (req, res) => {
  const db = req.app.get("db");
  db.todos.destroy({ id: req.params.id });
});

app.use(cors());
app.use(json());

app.listen(port, () => {
  console.log(`This is Dr. I'm listening @ port ${port}`);
});
