const express = require("express");
const bodyParser = require("body-parser");
let config = require('../../config');
let middleware = require('../../token');
const knex = require("./chatDb");
const tableName = "messages";

let Chat = {
  save: async (userId, senderId, message, date) => {
    return knex('messages').insert(
      {
        user_id: userId,
        sender_id: senderId,
        message: message,
        created_on: date
      });
  },
  getMessages: async (userId, senderId) => {
    return knex(tableName).where(
      {
        user_id: senderId,
        sender_id: userId
      }).orWhere(
        {
          user_id: userId,
          sender_id: senderId
        });
  }
}

module.exports = Chat;
