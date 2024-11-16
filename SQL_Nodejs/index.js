require("dotenv").config();
const { faker } = require("@faker-js/faker");
const mysql = require("mysql2");
const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const { v4: uuidv4 } = require("uuid");
const { use } = require("marked");

app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

let createRandomUser = () => {
  return [
    faker.string.uuid(),
    faker.internet.username(),
    faker.internet.email(),
    faker.internet.password(),
  ];
};

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.MYSQL_PASSWORD,
});

app.get("/", (req, res) => {
  let q = "SELECT count(*) FROM user"; //NOTE: Total number of Users in the table
  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      console.log(result[0]["count(*)"]);
      let count = result[0]["count(*)"];
      res.render("Home.ejs", { count });
    });
  } catch (err) {
    console.log(err);
    res.send("Some Error in DB");
  }
});

app.get("/insert", (req, res) => {
  res.render("insert.ejs");
});

app.post("/join", (req, res) => {
  let { username, password, email } = req.body;
  let id = uuidv4();
  let q = `INSERT INTO user (id, username, password, email) VALUES ('${id}', '${username}', '${password}', '${email}')`;
  try {
    connection.query(q, (err, results) => {
      if (err) throw err;
      res.redirect("/");
    });
  } catch (err) {
    console.log(err);
    res.send("Some Error in DB");
  }
});

app.get("/user", (req, res) => {
  let q = "SELECT * FROM user";
  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      res.render("user.ejs", { result });
    });
  } catch (err) {
    console.log(err);
    res.send("Some Error in DB");
  }
});

app.get("/user/:id/edit", (req, res) => {
  let { id } = req.params;
  console.log(id);
  let q = `SELECT * FROM user WHERE id = '${id}'`;
  try {
    connection.query(q, (err, results) => {
      if (err) throw err;
      let user = results[0];
      console.log(results[0]);
      res.render("edit.ejs", { user });
    });
  } catch (err) {
    console.log(err);
    res.send("Some Error in DB");
  }
});

//NOTE: Update (In DB) Route
app.patch("/user/:id", (req, res) => {
  let { id } = req.params;
  let { password: formPass, username: newUsername } = req.body;
  console.log(id);
  let q = `SELECT * FROM user WHERE id = '${id}'`;
  try {
    connection.query(q, (err, results) => {
      if (err) throw err;
      let user = results[0];
      if (formPass != user.password) res.send("Wrong Password");
      else {
        let q2 = `UPDATE user SET username='${newUsername}' WHERE id='${id}'`;
        try {
          connection.query(q2, (err, result) => {
            if (err) throw err;
            res.redirect("/user");
          });
        } catch (err) {
          console.log(err);
          res.send("Some error in DB");
        }
      }
    });
  } catch (err) {
    console.log(err);
    res.send("Some Error in DB");
  }
});

app.listen("8080", () => {
  console.log("Server listening to port 8080");
});

app.get("/user/:id/delete", (req, res) => {
  let { id } = req.params;
  console.log(id);
  let q = `SELECT * FROM user WHERE id = '${id}'`;
  try {
    connection.query(q, (err, results) => {
      if (err) throw err;
      let user = results[0];
      console.log(results[0]);
      res.render("delete.ejs", { user });
    });
  } catch (err) {
    console.log(err);
    res.send("Some Error in DB");
  }
});

app.delete("/user/:id", (req, res) => {
  let { id } = req.params;
  let { password: formPass, username: newUsername } = req.body;
  console.log(id);
  let q = `SELECT * FROM user WHERE id = '${id}'`;
  try {
    connection.query(q, (err, results) => {
      if (err) throw err;
      let user = results[0];
      if (formPass != user.password) res.send("Wrong Password");
      else {
        let q2 = `DELETE FROM user WHERE id='${id}'`;
        try {
          connection.query(q2, (err, result) => {
            if (err) throw err;
            console.log("Deleted!");
            res.redirect("/user");
          });
        } catch (err) {
          console.log(err);
          res.send("Some error in DB");
        }
      }
    });
  } catch (err) {
    console.log(err);
    res.send("Some Error in DB");
  }
});
// let createRandomUser = () => {
//   return {
//     userId: faker.string.uuid(),
//     username: faker.internet.username(), // before version 9.1.0, use userName()
//     email: faker.internet.email(),
//     avatar: faker.image.avatar(),
//     password: faker.internet.password(),
//     birthdate: faker.date.birthdate(),
//     registeredAt: faker.date.past(),
//   };
// };

// let query = "INSERT INTO user (id, username, email, password) VALUES ?";

// let data = [];
// for (let i = 0; i < 100; i++) {
//   data.push(createRandomUser());
// }

// try {
//   connection.query(query, [data], (err, results) => {
//     if (err) throw err;
//     console.log(results);
//   });
// } catch (err) {
//   console.log(err);
// }
