var router = require('express').Router();
var pg = require('pg');

var config = {
    database: 'upsilon'
};

var pool = new pg.Pool(config);

// routes to get and add task items
router.route('/')
    .get(getTasks)
    .post(postTasks);

// routes to update and delete task items
router.route('/:id')
    .put(updateTasks)
    .delete(deleteTasks);

// gets current list of tasks from DB
function getTasks(req, res) {
    pool.connect(function(err, client, done) {
        try {
            if (err) {
                res.sendStatus(500);
                return;
            }

            client.query('SELECT * FROM tasks ORDER BY id;',
                function(err, result) {
                    if (err) {
                        console.log('Error querying the DB', err);
                        res.sendStatus(500);
                        return;
                    }

                    res.send(result.rows);
                });
        } finally {
            done();
        }
    });
};

// posts a new task to DB
function postTasks(req, res) {
    pool.connect(function(err, client, done) {
        console.log('req: ', req.body);
        try {
            if (err) {
                res.sendStatus(500);
                return;
            }

            client.query('INSERT INTO tasks (item, complete) VALUES ($1, $2) RETURNING *;', [req.body.item, false],
                function(err, result) {
                    if (err) {
                        console.log('Error querying the DB', err);
                        res.sendStatus(500);
                        return;
                    }

                    res.sendStatus(200);
                });
        } finally {
            done();
        }
    });
};

// deletes item from DB
function deleteTasks(req, res) {
    var id = req.params.id;

    pool.connect(function(err, client, done) {
        try {
            if (err) {
                console.log('Error connecting to the DB', err);
                res.sendStatus(500);
                return;
            }

            client.query('DELETE FROM tasks WHERE id=$1;', [id],
                function(err, result) {
                    if (err) {
                        console.log('Error querying the database', err);
                        res.SendStatus(500);
                        return;
                    }

                    res.sendStatus(200);
                });
        } finally {
            done();
        }
    });
};

// updates an item in DB
function updateTasks(req, res) {
    var id = req.params.id;
    var complete = (req.body.complete);

    pool.connect(function(err, client, done) {
        try {
            if (err) {
                res.sendStatus(500);
                return;
            }

            client.query('UPDATE tasks SET complete = $1 WHERE id = $2;', [complete, id],
                function(err, result) {
                    if (err) {
                        console.log('Error querying the DB', err);
                        res.sendStatus(500);
                        return;
                    }

                    res.sendStatus(200);
                });
        } finally {
            done();
        }
    });
};

module.exports = router;
