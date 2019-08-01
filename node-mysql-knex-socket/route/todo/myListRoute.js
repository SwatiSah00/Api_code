const express = require("express");
const bodyParser = require("body-parser");
var moment = require('moment');
const tokenValidator = require("../../token")
const knex = require("./todoDb");
const router = express.Router();
const tableName = "my_list";


router.route("/").post(tokenValidator.checkToken, async (req, res, next) => {
  try {
    if (!req.body.listName)
      res.json({ status: false, message: 'List Name is mandatory' });
    else {
      var decryptToken = req.decoded;
      await knex(tableName).insert(
        {
          user_id: decryptToken.loginId,
          list_name: req.body.listName,
          // completion_date: new Date(req.body.completionDate),
          // created_on: new Date(),
        })
        .then(function (result) {
          res.json({ status: true, message: 'ok' });
        })
        .catch(function (err) {

          res.json({ status: false, message: '', data: err });
        });
    }
  } catch (err) {
    res.json({ status: false, message: '', data: err });
  }
});

router.route("/").get(tokenValidator.checkToken, async (req, res, next) => {
  try {
    var decryptToken = req.decoded;
    let main_todo = await knex(tableName).where(
      {
        user_id: decryptToken.loginId,
      })
    await knex.select('list_id').from('share_list').where(
      {
        sender_id: decryptToken.loginId,
      })
      .then(async function (todoIds) {

        let ids = todoIds.map(x => x.list_id);

        let data = await knex.from('my_list')
          .whereIn('id', ids)
          .then(function (result) {
            // Modify the data for sharing
            main_todo.map(v => v.sharable = true);
            result.map(v => v.sharable = false);

            res.json({ status: true, message: 'ok', data: [...result, ...main_todo] });
          })
          .catch(function (err) {

            res.json({ status: false, message: '', data: err });
          });
      })
      .catch(function (err) {

        res.json({ status: false, message: '', data: err });
      });

  } catch (err) {
    res.json({ status: false, message: '', data: err });
  }

});

router.route("/:todoId").delete(tokenValidator.checkToken, async (req, res, next) => {
  try {
    var decryptToken = req.decoded;
    if (!req.params.todoId)
      res.json({ status: false, message: 'Pass todoId parameter' });
    else
      await knex(tableName)
        .where('id', req.params.todoId)
        .del()
        .then(function (result) {
          res.json({ status: true, message: 'ok' });
        })
        .catch(function (err) {
          res.json({ status: false, message: '', data: err });
        });
  } catch (err) {
    res.json({ status: false, message: '', data: err });
  }

});

module.exports = router;


