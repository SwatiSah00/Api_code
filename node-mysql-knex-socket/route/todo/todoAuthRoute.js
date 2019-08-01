const express = require("express");
const bodyParser = require("body-parser");
let jwt = require('jsonwebtoken');
let config = require('../../config');
let tokenValidator = require('../../token');
const knex = require("./todoDb");
const router = express.Router();
const tableName = "users";

router.route("/").post(async (req, res, next) => {
  try {
    if (!req.body.loginId)
      res.json({ status: false, message: 'loginId field is mandatory' });
    if (!req.body.password)
      res.json({ status: false, message: 'password field is mandatory' });

    let login_id = req.body.loginId.toLowerCase();
    let password = req.body.password;
    await knex(tableName).where(
      {
        login_id: login_id,
        password: password
      }).select('id')
      .then(function (result) {
        if (result.length == 0) {
          res.json({ status: false, message: 'Invalid credentials', data: null });
          // res.send(403).json({
          //   success: false,
          //   message: 'Incorrect username or password'
          // });
        } else {
          let token = jwt.sign({
            loginId: result[0].id,
            app: 'todo'
          },
            config.secret,
            {
              expiresIn: '24h' // expires in 24 hours
            }
          );
          // return the JWT token for the future API calls
          res.cookie('jwt', token); // add cookie here
          res.json({
            status: true,
            message: 'Authentication successful!',
            // token: token
          });
        }
        // res.json({ status: true, message: 'ok', data: result });
      })
      .catch(function (err) {

        res.json({ status: false, message: '', data: err });
      });
  }
  catch (err) {
    res.json({ status: false, message: '', data: err });
  }
});

router.route("/logout").get(tokenValidator.checkToken, (req, res, next) => {
  try {
    res.cookie('jwt', ''); // add cookie here
    res.json({
      status: true,
      message: 'Logged Out!',
      // token: token
    });
  } catch (err) {
    res.json({ status: false, message: '', data: err });
  }
});

router.route("/validateToken").get(tokenValidator.checkToken, (req, res, next) => {
  try {
    res.json({ status: true, message: 'Valid token', data: null });
  } catch (err) {
    res.json({ status: false, message: '', data: err });
  }
});

module.exports = router;
