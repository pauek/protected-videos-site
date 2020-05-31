const { PASSWORD, ADMIN_PASSWORD, MAX_AGE } = require("./config");
const express = require("express");
const routes = express.Router();
const tokendb = require("./tokendb");
const { log } = require("./log");

const loginPage = (message = "") => `
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Login</title>
    <style>
      body {
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #eef;
        font-family: sans-serif;
      }
      form {
        text-align: center;
      }
      input {
        margin-top: .2rem;
        padding: .2rem .3rem;
      }
    </style>
  </head>
  <body>
    <p>${message}</p>
    <form action="/login" method="post">
      <p>
        <label>
          Password <br>
          <input type="password" name="password" />
        </label>
      </p>
    </form>
  </body>
</html>
`;

routes.get("/login", (req, res) => {
  log("GET login");
  res.send(loginPage());
});

routes.post("/login", (req, res) => {
  const { password } = req.body;
  log("POST /login:", password);
  if (password === ADMIN_PASSWORD) {
    const token = tokendb.createToken({ maxAge: MAX_AGE, admin: true });
    res.cookie("token", token, { maxAge: MAX_AGE });
    res.redirect("/");
  } else if (password === PASSWORD) {
    const token = tokendb.createToken({ maxAge: MAX_AGE });
    res.cookie("token", token, { maxAge: MAX_AGE });
    res.redirect("/");
  } else {
    res.send(loginPage("Incorrect password"));
  }
});

routes.get("/logout", (req, res) => {
  res.clearCookie('token');
  res.redirect('/login');
})

module.exports = routes;
