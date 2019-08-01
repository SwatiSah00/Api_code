const express = require("express");
const bodyParser = require("body-parser");
var moment = require('moment');
const tokenValidator = require("../../token")
const knex = require("./todoDb");
const router = express.Router();
const tableName = "share_list";


router.route("/").post(tokenValidator.checkToken, async (req, res, next) => {
  try {
    if (!req.body.senderId)
      res.json({ status: false, message: 'Sender ID is mandatory' });
    if (!req.body.listId)
      res.json({ status: false, message: 'Todo Id is mandatory' });
    else {
      var decryptToken = req.decoded;
      var _senderId = "";
      await knex('users').where({
        login_id: req.body.senderId
      }).select('id').then(async (id) => {
        _senderId = id;
        if (_senderId.length != 0) {
          _senderId = _senderId[0].id;
          await knex(tableName).where(
            {
              user_id: decryptToken.loginId,
              list_id: req.body.listId,
              sender_id: _senderId
            }).select('*')
            .then(async function (result) {
              if (result.length != 0) {
                res.json({ status: false, message: 'ToDo item already mapped to this user', data: null });
              } else {
                await knex(tableName).insert(
                  {
                    user_id: decryptToken.loginId,
                    list_id: req.body.listId,
                    sender_id: _senderId,
                    // created_on: new Date()
                  })
                  .then(function (result) {
                    res.json({ status: true, message: 'ok' });
                  })
                  .catch(function (err) {
                    res.json({ status: false, message: '', data: err });
                  });
              }
            });
        }
        else {
          res.json({ status: false, message: 'Please verify the user id to whom you want to share', data: null });
        }
      });
    }
  } catch (err) {
    res.json({ status: false, message: 'Error occured', data: err });
  }

});

router.route("/").get(tokenValidator.checkToken, async (req, res, next) => {
  try {
    var decryptToken = req.decoded;
    await knex(tableName).where(
      {
        user_id: decryptToken.loginId,
      })
      .then(function (result) {
        res.json({ status: true, message: 'ok', data: result });
      })
      .catch(function (err) {
        res.json({ status: false, message: '', data: err });
      });
  } catch (err) {
    res.json({ status: false, message: '', data: err });
  }
});

module.exports = router;


