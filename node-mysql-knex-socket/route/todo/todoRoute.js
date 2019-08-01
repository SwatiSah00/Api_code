const express = require("express");
const bodyParser = require("body-parser");
var moment = require('moment');
const tokenValidator = require("../../token")
const knex = require("./todoDb");
const router = express.Router();
const tableName = "todo";


router.route("/").post(tokenValidator.checkToken, async (req, res, next) => {
  try {
    if (!req.body.subject)
      res.json({ status: false, message: 'Subject field is mandatory' });
    if (!req.body.description)
      res.json({ status: false, message: 'Description field is mandatory' });
    if (!req.body.completionDate)
      res.json({ status: false, message: 'Completion Date field is mandatory' });
    else {
      var decryptToken = req.decoded;
      await knex(tableName).insert(
        {
          user_id: decryptToken.loginId,
          list_id: req.body.listId,
          subject: req.body.subject,
          description: req.body.description,
          completion_date: new Date(req.body.completionDate),
          created_on: new Date(),
          status_id: 1 // Default In Progress
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

router.route("/:listId").get(tokenValidator.checkToken, async (req, res, next) => {
  try {
    if (!req.params.listId)
      res.json({ status: false, message: 'List Id not found' });

    var decryptToken = req.decoded;
    //  knex.from('todo').innerJoin('share_list', 'todo.id', 'share_list.todo_id')
    // await  knex.select('*').from('todo').join('share_list', function () {
    //   this.on(function () {
    //     this.on('todo.user_id', '=', 'share_list.sender_id')
    //   })
    // })
    // let main_todo = await knex(tableName).where(
    //   {
    //     user_id: decryptToken.loginId,
    //   })
    // await knex.select('list_id').from('share_list').where(
    //   {
    //     sender_id: decryptToken.loginId,
    //   })
    //   .then(async function (todoIds) {

    //     let ids = todoIds.map(x => x.list_id);

    //     let data = await knex.from('todo')
    //       .whereIn('list_id', ids)
    //       .then(function (result) {
    //         res.json({ status: true, message: 'ok', data: [...result, ...main_todo] });
    //       })
    //       .catch(function (err) {
    //         res.json({ status: false, message: '', data: err });
    //       });
    //   })
    //   .catch(function (err) {

    //     res.json({ status: false, message: '', data: err });
    //   });

    await knex.from('todo')
      .where('list_id', req.params.listId)
      .then(function (result) {
        res.json({ status: true, message: 'ok', data: [...result] });
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


