import express from "express";
import mongodb, { MongoClient } from "mongodb";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 3022;
app.use(cors());

// const mongoConnectionsString = "mongodb://localhost:27017";
const mongoConnectionsString = process.env.MONGODB_URI;
const client = new MongoClient(mongoConnectionsString);
app.use(express.json());

const getDatabase = async (done) => {
  await client.connect();
  const db = client.db("users100");
  done(db);
};

// app.get('/', (req, res) => {
//     res.send("it works(TEST)")
// })

app.get("/", (req, res) => {
  getDatabase(async (db) => {
    const users = await db
      .collection("usersdata")
      .find()
      .project({
        name: 1,
        username: 1,
        email: 1,
      })
      .toArray();
    res.json(users);
  });
});

// app.delete("/deleteuser/:id", (req, res) => {
//   const id = req.params.id;
//   res.send(id);
// });

app.delete("/deleteuser/:id", (req, res) => {
  const id = req.params.id;
  getDatabase(async (db) => {
    const deleteResult = await db
      .collection("usersdata")
      .deleteOne({ _id: new mongodb.ObjectId(id) });
    res.json({
      result: deleteResult,
    });
  });
});

app.post("/adduser/", (req, res) => {
  const user = req.body.user;
  getDatabase(async (db) => {
    const insertResult = await db.collection("usersdata").insertOne(user);
    res.json(insertResult);
  });
});

app.patch("/edituser/:id", (req, res) => {
  const id = req.params.id;
  const email = req.body.email;
  getDatabase(async (db) => {
    const updateResult = await db
      .collection("usersdata")
      .updateOne({ _id: new mongodb.ObjectId(id) }, { $set: { email } });
    res.json({
      result: updateResult,
    });
  });
});

app.listen(port, () => {
  console.log(`listen on http://localhost:${port}`);
});
