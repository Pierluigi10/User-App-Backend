import express from "express";
import mongodb, { MongoClient } from "mongodb";

const app = express();
const port = 3022;

const mongoConnectionsString = "mongodb://localhost:27017";
const client = new MongoClient(mongoConnectionsString);
app.use(express.json());

const getDatabase = async (done) => {
  await client.connect();
  const db = client.db("api001");
  done(db);
};

// app.get('/', (req, res) => {
//     res.send("it works(TEST)")
// })

app.get("/", (req, res) => {
  getDatabase(async (db) => {
    const users = await db
      .collection("users100")
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
      .collection("users100")
      .deleteOne({ _id: new mongodb.ObjectId(id) });
    res.json({
      result: deleteResult,
    });
  });
});

app.post("/adduser/", (req, res) => {
  const user = req.body.user;
  getDatabase(async (db) => {
    const insertResult = await db.collection("users100").insertOne(user);
    res.json(insertResult);
  });
});

app.listen(port, () => {
  console.log(`listen on http://localhost:${port}`);
});
