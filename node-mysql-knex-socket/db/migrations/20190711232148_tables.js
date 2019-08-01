

exports.up = function (knex, Promise) {
    return knex.schema.createTableIfNotExists("users", function (t) {
        t.increments('id').primary();
        t.string('login_id', 100);
        t.string('password', 100);
        t.dateTime('created_on', 100);
    }).createTableIfNotExists("todo", function (t) {
        t.increments('id').primary();
        t.integer('user_id', 11);
        t.string('subject', 100);
        t.string('description', 100);
        t.dateTime('created_on', 100);
        t.dateTime('completion_date', 100);
        t.integer('status_id', 1);
    }).createTableIfNotExists("status", function (t) {
        t.increments('id').primary();
        t.string('status_type', 100);
    }).then(function () {
        return knex("status").insert([
            { status_type: "In Progress" },
            { status_type: "Completed" },
        ]);
    })
};

exports.down = function (knex) {
    return knex.schema.dropTableIfExists("users")
        .dropTableIfExists("todo")
        .dropTableIfExists("status");
};