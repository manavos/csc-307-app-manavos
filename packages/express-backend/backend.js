// backend.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import userService from './services/user-service.js'; // Add this line

dotenv.config();

const { MONGO_CONNECTION_STRING } = process.env;

mongoose.set("debug", true);
mongoose
  .connect(MONGO_CONNECTION_STRING + "users") // connect to Db "users"
  .catch((error) => console.log(error));


const app = express();
const port = 8000;

app.use(cors())

app.use(express.json());


app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/users", (req, res) => {
  const { name, job } = req.query;

  const query = {};
  if (name) query.name = name;
  if (job) query.job = job;

  console.log("Query being sent to MongoDB:", query);

  userService
    .getUsers(name, job)
    .then((result) => {
      console.log("Result from MongoDB:", result);
      res.json({ users_list: result });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("An error occurred in the server.");
    });
});


app.get("/users/:id", (req, res) => {
  const id = req.params["id"];
  userService
    .findUserById(id)
    .then((result) => {
      if (!result) {
        res.status(404).send("User not found.");
      } else {
        res.json(result); 
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send("An error occurred in the server.");
    });
});

// Route to add a new user
app.post("/users", (req, res) => {
  const user = req.body;

  userService
    .addUser(user)
    .then((savedUser) => {
      res.status(201).json(savedUser); // Send the saved user in the response
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send("An error occurred in the server.");
    });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});