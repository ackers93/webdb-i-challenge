const express = require("express");

const knex = require("./data/dbConfig.js");

const server = express();

server.use(express.json());

server.get("/", (req, res) => {
  res.send("<h3>DB Helpers with knex</h3>");
});

server.get("/accounts", (req, res) => {
  knex
    .select("*")

    .from("accounts")
    .then(acct => {
      res.status(200).json(acct);
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        errorMessage: "error getting the accounts"
      });
    });
});

server.get("/accounts/:id", (req, res) => {
  knex
    .select("*")
    .from("accounts")
    .where({ id: req.params.id })
    .first()
    .then(acct => {
      res.status(200).json(acct);
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        errorMessage: "error getting the post"
      });
    });
});

server.post("/accounts", (req, res) => {
  const accountData = req.body;
  knex("accounts")
    .insert(accountData, "id")
    .then(ids => {
      const id = ids[0];

      return knex("accounts")
        .select("id", "name", "budget")
        .where({ id })
        .first()
        .then(post => {
          res.status(201).json(post);
        });
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        errorMessage: "error adding the account"
      });
    });
});

server.put("/accounts/:id", (req, res) => {
  const { id } = req.params;
  const changes = req.body;

  knex("accounts")
    .where({ id })
    .update(changes)
    .then(count => {
      if (count > 0) {
        res.status(200).json({
          message: ` ${count} record updated`
        });
      } else {
        res.status(404).json({ message: "account not found" });
      }
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        errorMessage: "error updating the account"
      });
    });
});

server.delete("/accounts/:id", (req, res) => {
  const { id } = req.params;

  // validate the data
  knex("accounts")
    .where({ id }) //always filter on update and delete
    .delete()
    .then(count => {
      res.status(200).json({
        message: ` ${count} record deleted`
      });
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        errorMessage: "error deleting the account"
      });
    });
});
module.exports = server;
