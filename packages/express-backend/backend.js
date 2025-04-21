// backend.js
import express from "express";
import cors from "cors";

const app = express();
const port = 8000;

app.use(cors())

app.use(express.json());

const users = {
  users_list: [
    {
      id: "xyz789",
      name: "Charlie",
      job: "Janitor"
    },
    {
      id: "abc123",
      name: "Mac",
      job: "Bouncer"
    },
    {
      id: "ppp222",
      name: "Mac",
      job: "Professor"
    },
    {
      id: "yat999",
      name: "Dee",
      job: "Aspring actress"
    },
    {
      id: "zap555",
      name: "Dennis",
      job: "Bartender"
    }
  ]
};

app.get("/", (req, res) => { // http://localhost:8000/ 
  res.send("Hello World!");
});

const findUserByName = (name) => {
  return users["users_list"].filter(
    (user) => user["name"] === name
  );
};


app.get("/users", (req, res) => { //  http://localhost:8000/users
  const name = req.query.name;
  if (name != undefined) {
    let result = findUserByName(name);
    result = { users_list: result };
    res.send(result);
  } else {
    res.send(users);
  }
});

//define more specific routes before general ones!!
const findUserByNameandJob = (name, job) =>
  users["users_list"].filter((user) => user["name"] === name && user["job"] === job);

app.get("/users/search", (req, res) => {
  const {name, job} = req.query;

  if (!name || !job) {
    return res.status(400).send("Both name and job are required in query.");
  }
  console.log("Query params:", req.query);

  let result = findUserByNameandJob(name, job);

  console.log("Search result:", result);

  if (result.length === 0) {
    res.status(404).send("Resource not found.");
  } else {
    res.send(result);
  }
});

const findUserById = (id) =>
  users["users_list"].find((user) => user["id"] === id);

app.get("/users/:id", (req, res) => {
  const id = req.params["id"]; //or req.params.id
  let result = findUserById(id);
  if (result === undefined) {
    res.status(404).send("Resource not found.");
  } else {
    res.send(result);
  }
});

const addUser = (user) => {
  users["users_list"].push(user);
  return user;
};

app.post("/users", (req, res) => {
  const userToAdd = req.body;
  addUser(userToAdd);
  res.send();
});

const deleteUserByID = (id) => {
  const originalLength = users["users_list"].length;
  users["users_list"] = users["users_list"].filter(user => user.id !== id);
  return users["users_list"].length < originalLength; // true if something was deleted
};

app.delete("/users/:id", (req, res) => {
  const id = req.params["id"];
  const wasDeleted = deleteUserByID(id);

  if (!wasDeleted) {
    res.status(404).send("User not found.");
  } else {
    res.send();
  }
});



app.listen(port, () => {
  console.log(
    `Example app listening at http://localhost:${port}`
  );
});